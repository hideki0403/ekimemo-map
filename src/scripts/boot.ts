import * as themeManager from './theme'
import * as updator from './updator'
import { stateStore } from './store'
import dayjs from 'dayjs'

export default async function() {
    themeManager.watchThemeChange()
    themeManager.applyTheme()

    if (dayjs().diff(dayjs(stateStore.get('lastCheck')), 'day') > 1) {
        const result = await updator.check().catch((e) => console.error(e))
        if (result instanceof Error || !result) return
        if (result.updateAvailable) {
            // TODO: トースト通知を出す
            console.log(`Station data update available (v${result.version}, ${result.size} bytes)`)
            const updateResult = await updator.execute()
        }
    }
}