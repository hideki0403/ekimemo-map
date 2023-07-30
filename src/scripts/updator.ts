import * as database from './database'
import { stateStore } from './store'

export async function execute() {
    let data: any

    try {
        data = await (await fetch('https://raw.githubusercontent.com/Seo-4d696b75/station_database/main/out/main/data.json')).json()
    } catch(e) {
        console.error('Update failed', e)
        return false
    }
    
    await database.cache.lines.clear()
    await database.cache.lines.bulkPut(data.lines)
    await database.cache.stations.clear()
    await database.cache.stations.bulkPut(data.stations)
    await database.cache.treeSegments.clear()
    await database.cache.treeSegments.bulkPut(data.tree_segments)

    stateStore.set('currentVersion', data.version)
    console.log(`Station data updated to v${data.version}`)

    return true
}

export async function check() {
    let result
    try {
        result = await (await fetch('https://raw.githubusercontent.com/Seo-4d696b75/station_database/main/latest_info.json')).json()
    } catch {
        return new Error('Failed to check update')
    }
    
    const latestVersion = result.version

    stateStore.set('lastCheck', new Date().toISOString())
    return {
        updateAvailable: latestVersion !== stateStore.get('currentVersion'),
        version: latestVersion,
        url: result.url,
        size: result.size,
    }
}
