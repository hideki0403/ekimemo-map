import * as database from './database'
import { stateStore } from './store'

export async function execute() {
    let lines: any[] = []
    let stations: any[] = []

    try {
        const links = {} as Record<string, string>
        const response = await (await fetch('https://api.github.com/repos/Seo-4d696b75/station_database/contents/out/main')).json()
        response.forEach((file: { name: string, size: number, download_url: string }) => {
            if (['station.json', 'line.json'].includes(file.name)) {
                links[file.name.replace('.json', '')] = file.download_url
            }
        })

        lines = await (await fetch(links.line)).json()
        stations = await (await fetch(links.station)).json()
    } catch(e) {
        console.error(e)
        return false
    }
    
    await database.cache.lines.clear()
    await database.cache.lines.bulkPut(lines)
    await database.cache.stations.clear()
    await database.cache.stations.bulkPut(stations)

    return true
}

export async function check() {
    let result
    try {
        result = await (await fetch('https://api.github.com/repos/Seo-4d696b75/station_database/releases/latest')).json()
    } catch {
        return new Error('Failed to check update')
    }
    
    const latestVersion = result.tag_name

    stateStore.set('lastCheck', new Date().toISOString())
    return {
        updateAvailable: latestVersion !== stateStore.get('currentVersion'),
        latestVersion,
    }
}
