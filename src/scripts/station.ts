import * as database from './database'
import { settingsStore } from './store'
import { measure } from './utils'
import { showStationNotification } from './notification'
import dayjs from 'dayjs'

type Bounds = {
    north: number
    east: number
    south: number
    west: number
}

export type StationData = {
    station: database.Station
    distance: number
    lastAccess: Date | null
    accessCount: number
    isNew: boolean
    index?: number
}

function isInsideRect(bounds: Bounds, lat: number, lng: number) {
    return lat >= bounds.south && lat <= bounds.north && lng >= bounds.west && lng <= bounds.east
}

// 参考: https://github.com/Seo-4d696b75/ekisagasu/blob/main/src/script/kdTree.ts
// Thanks to @Seo-4d696b75
class StationNode {
    depth: number
    code: number
    region: Bounds

    segmentName?: string
    station?: database.Station
    left?: StationNode
    right?: StationNode

    constructor(depth: number, data: database.TreeNode, region: Bounds) {
        this.depth = depth
        this.code = data.code
        this.region = region
    }

    async build(data: database.TreeNode, dataMap: Map<number, database.TreeNode>) {
        await this.buildTree(data, dataMap)
        return this
    }

    async buildTree(data: database.TreeNode, dataMap: Map<number, database.TreeNode>) {
        // LeafNode
        if (data.segment) {
            this.segmentName = data.segment
            return
        }

        this.station = await database.cache.stations.get(data.code)
        if (!this.station) throw new Error(`Station ${data.code} not found`)
        if (!isInsideRect(this.region, this.station.lat, this.station.lng)) throw new Error(`Station ${data.code} is out of region`)

        const isEven = this.depth % 2 === 0

        if (data.left) {
            const left = dataMap.get(data.left)
            if (!left) throw new Error(`Node ${data.left} not found`)

            this.left = await new StationNode(this.depth + 1, left, {
                north: isEven ? this.region.north : this.station.lat,
                south: this.region.south,
                east: isEven ? this.station.lng : this.region.east,
                west: this.region.west,
            }).build(left, dataMap)
        }

        if (data.right) {
            const right = dataMap.get(data.right)
            if (!right) throw new Error(`Node ${data.right} not found`)

            this.right = await new StationNode(this.depth + 1, right, {
                north: this.region.north,
                south: isEven ? this.region.south : this.station.lat,
                east: this.region.east,
                west: isEven ? this.station.lng : this.region.west,
            }).build(right, dataMap)
        }
    }

    clear() {
        this.station = undefined
        this.left?.clear()
        this.right?.clear()
        this.left = undefined
        this.right = undefined
    }

    async get() {
        if (this.station) return this.station
        if (!this.segmentName) throw new Error('Segment name not found')

        const treeSegment = await database.cache.treeSegments.get(this.segmentName)
        if (!treeSegment) throw new Error(`Tree segment ${this.segmentName} not found`)

        if (treeSegment.root !== this.code) throw new Error('Root node is not matched')

        const dataMap = new Map<number, database.TreeNode>()
        treeSegment.node_list.forEach((node) => dataMap.set(node.code, node))

        const rootNode = dataMap.get(treeSegment.root)
        if (!rootNode) throw new Error(`Root node ${treeSegment.root} not found`)

        await this.buildTree(rootNode, dataMap)

        if (!this.station) throw new Error('Station not found')
        return this.station
    }
}

class StationTree {
    root?: StationNode
    lastPosition?: { latitude: number, longitude: number }
    lastChangedDate?: Date
    currentStation?: database.Station
    searchList = [] as { station: database.Station, distance: number }[]
    reactiveSearchList = ref([] as StationData[])
    serviceAvailable = false
    locked = false

    constructor() {}

    async initialize(rootName = 'root') {
        if (!await database.cache.treeSegments.count()) return this

        const treeSegment = await database.cache.treeSegments.get(rootName)
        const dataMap = new Map<number, database.TreeNode>()

        if (!treeSegment) throw new Error(`Tree segment ${rootName} not found`)
        treeSegment.node_list.forEach((node) => dataMap.set(node.code, node))

        const rootNode = dataMap.get(treeSegment.root)
        if (!rootNode) throw new Error(`Root node ${treeSegment.root} not found`)
        this.root = await new StationNode(0, rootNode, {
            north: 90,
            south: -90,
            east: 180,
            west: -180,
        }).build(rootNode, dataMap)

        this.serviceAvailable = true

        return this
    }

    clear() {
        this.root?.clear()
        this.root = undefined
    }

    async updateLocation(latitude: number, longitude: number, maxDistance = 0) {
        const maxResults = settingsStore.get('stationResultCount')
        if (maxResults < 1) throw new Error('maxResults must be greater than 0')
        if (!this.root) throw new Error('Tree not initialized')
        if (this.searchList.length >= maxResults && this.lastPosition?.latitude === latitude && this.lastPosition?.longitude === longitude) return
        if (this.locked) return

        this.locked = true
        this.searchList = []
        await this.search(this.root, latitude, longitude, maxResults, maxDistance)

        const currentStation = this.searchList[0].station
        const isChangedStation = currentStation.code !== this.currentStation?.code
        this.currentStation = currentStation
        this.lastPosition = { latitude, longitude }

        let lastAccess: undefined | string = undefined
        if (isChangedStation) {
            const now = new Date()
            this.lastChangedDate = now

            const accessLog = await database.states.accessLog.get(currentStation.id)
            const updateObject = {
                lastAccess: now.toISOString(),
                accessCount: (accessLog?.accessCount ?? 0) + 1,
            } as Partial<database.AccessLog>

            lastAccess = accessLog?.lastAccess

            // もしレコードがなければ新規作成
            if (!accessLog) {
                updateObject.firstAccess = now.toISOString()
                updateObject.id = currentStation.id
                
                await database.states.accessLog.add(updateObject as database.AccessLog)
            } else {
                await database.states.accessLog.update(currentStation.id, updateObject)
            }
        }

        this.reactiveSearchList.value = await Promise.all(this.searchList.map(async (x, i) => {
            const accessLog = await database.states.accessLog.get(x.station.id)

            const result = {
                station: x.station,
                distance: measure(latitude, longitude, x.station.lat, x.station.lng),
                lastAccess: accessLog?.lastAccess ? new Date(accessLog.lastAccess) : null,
                accessCount: accessLog?.accessCount ?? 0,
                isNew: !accessLog?.accessCount,
                index: i + 1,
            }

            if (i === 0 && isChangedStation) {
                const cooldown = settingsStore.get('cooldownSeconds')
                const isCooldown = dayjs().diff(lastAccess ?? 0, 'second') < cooldown
                if (!lastAccess || (cooldown && !isCooldown)) showStationNotification(result)
            }

            return result
        }))
        
        this.locked = false
        return
    }

    async updateRectRegion(rect: Bounds, max: number) {
        if (!this.root) throw new Error('Tree not initialized')

        const dist = [] as database.Station[]
        await this.searchRect(this.root, rect, dist, max)
        return dist
    }

    get getReactive() {
        return this.reactiveSearchList
    }

    getAllNearStations() {
        return this.searchList.map(x => x.station)
    }

    getNearStations(size: number) {
        if (!this.searchList) return []
        if (size < 0) size = 0
        if (size > this.searchList.length) size = this.searchList.length

        return this.searchList.slice(0, size).map(x => x.station)
    }

    async search(node: StationNode, latitude: number, longitude: number, maxResults: number, maxDistance = 0) {
        const div = {
            value: 0,
            threshold: 0,
        }

        const s = await node.get()
        const d = Math.sqrt(Math.pow(s.lat - latitude, 2) + Math.pow(s.lng - longitude, 2))

        let index = -1
        let size = this.searchList.length

        if (size > 0 && d < this.searchList[size - 1].distance) {
            index = size - 1
            while (index > 0) {
                if (d >= this.searchList[index - 1].distance) break
                index--
            }
        } else if (!size) {
            index = 0
        }

        if (index >= 0) {
            this.searchList.splice(index, 0, { station: s, distance: d })
            if (size >= maxResults && this.searchList[size].distance > maxDistance) this.searchList.pop()
        }

        const isEven = node.depth % 2 === 0
        div.value = isEven ? longitude : latitude
        div.threshold = isEven ? s.lng : s.lat

        const next = div.value < div.threshold ? node.left : node.right
        if (next) await this.search(next, latitude, longitude, maxResults, maxDistance)

        const opposite = div.value < div.threshold ? node.right : node.left
        const list = this.searchList

        if (opposite && Math.abs(div.value - div.threshold) < Math.max(list[list.length - 1].distance, maxDistance)) {
            await this.search(opposite, latitude, longitude, maxResults, maxDistance)
        }
    }

    async searchRect(node: StationNode, rect: Bounds, dist: database.Station[], max: number) {
        const station = await node.get()
        if (max && dist.length >= max) return

        if (isInsideRect(rect, station.lat, station.lng)) {
            dist.push(station)
        }

        const tasks = [] as Promise<void>[]
        const leftCheck = node.depth % 2 === 0 ? rect.west < station.lng : rect.south < station.lat
        const rightCheck = node.depth % 2 === 0 ? station.lng < rect.east : station.lat < rect.north

        if (node.left && leftCheck) {
            tasks.push(this.searchRect(node.left, rect, dist, max))
        }

        if (node.right && rightCheck) {
            tasks.push(this.searchRect(node.right, rect, dist, max))
        }

        await Promise.all(tasks)
    }
}

export default await new StationTree().initialize()