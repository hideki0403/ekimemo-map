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
}

class StationCache extends Dexie {
    stations!: Table<Station>
    lines!: Table<Line>

    constructor() {
        super('stations')
        this.version(1).stores({
            stations: 'code, id, name, original_name, name_kana, closed, lat, lng, prefecture, lines, attr, postal_code, address, open_date, voronoi',
            lines: 'code, id, name, name_kana, station_size, company_code, closed, color'
        })
    }
}

export const cache = new StationCache()