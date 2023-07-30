export function measure(plat1: number, plon1: number, plat2: number, plon2: number) {
    let lng1 = Math.PI * plon1 / 180
    let lat1 = Math.PI * plat1 / 180
    let lng2 = Math.PI * plon2 / 180
    let lat2 = Math.PI * plat2 / 180
    let lng = (lng1 - lng2) / 2
    let lat = (lat1 - lat2) / 2
    return 6378137.0 * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(lat), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(lng), 2)))
}

export function beautifyScale(scale: number) {
    return scale < 1000 ? `${scale.toFixed(0)}m` : `${(scale / 1000).toFixed(1)}km`
}

export function beautifySeconds(seconds: number) {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`
}