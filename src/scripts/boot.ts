import * as themeManager from './theme'

export default function() {
    themeManager.watchThemeChange()
    themeManager.applyTheme()
}