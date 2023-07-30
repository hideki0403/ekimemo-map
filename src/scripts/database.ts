import Dexie, { Table } from 'dexie'

export interface Station {
    code: number
    id: string
    name: string
    original_name: string
    name_kana: string
    closed: boolean
    lat: number
    lng: number
    prefecture: number
    lines: number[]
    attr: string
    postal_code: string
    address: string
    open_date: string
    next: number[]
    voronoi: {
        type: string
        geometry: {
            type: string
            coordinates: number[][][]
        }
        properties: {}
    }
}

export interface Line {
    code: number
    id: string
    name: string
    name_kana: string
    station_size: number
    company_code: number
    closed: boolean
    color: string
    station_list: {
        code: number
        name: string
    }[]
    polyline_list: {
        type: string
        features: {}
        properties: {}
    }
}

export interface TreeNode {
    code: number
    name: string
    lat: number
    lng: number
    left?: number
    right?: number
    segment?: string
}

export interface TreeSegments {
    name: string
    root: number
    node_list: TreeNode[]
}

export interface AccessLog {
    id: string
    firstAccess: string
    lastAccess: string
    accessCount: number
}

class StationCache extends Dexie {
    stations!: Table<Station>
    lines!: Table<Line>
    treeSegments!: Table<TreeSegments>

    constructor() {
        super('cache')
        this.version(1).stores({
            stations: 'code, id, name, original_name, name_kana, closed, lat, lng, prefecture, lines, attr, postal_code, address, open_date, next, voronoi',
            lines: 'code, id, name, name_kana, station_size, company_code, closed, color, station_list, polyline_list',
            treeSegments: 'name, root, node_list',
        })
    }
}

class States extends Dexie {
    accessLog!: Table<AccessLog>

    constructor() {
        super('states')
        this.version(1).stores({
            accessLog: 'id, firstAccess, lastAccess, accessCount',
        })
    }
}

export const cache = new StationCache()
export const states = new States()