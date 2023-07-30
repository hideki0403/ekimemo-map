import type { StationData } from './station'
import { beautifySeconds, beautifyScale } from './utils'
import { settingsStore } from './store'

export function showStationNotification(data: StationData, reNotify: boolean = false) {
    const title = !reNotify ? `${data.station.name} が最寄り駅になりました` : `最後に通知してから${beautifySeconds(settingsStore.get('cooldownSeconds'), true)}が経過しました`
    const options: NotificationOptions = {
        body: beautifyScale(data.distance),
        renotify: true,
        tag: 'nearestStation',
        // icon: '/icon.png',
        vibrate: [100, 50, 100]
    }
    createNotification(title, options)
    console.log('showStationNotification', title, options)
}

function createNotification(title: string, options: NotificationOptions) {
    navigator.serviceWorker.controller?.postMessage({
        type: 'notificationCreate',
        payload: {
            title,
            options
        }
    })
}