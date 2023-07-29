import tinycolor from 'tinycolor2'
import { settingsStore } from '@/scripts/store'
import { getTheme } from '@/themes'

export function watchThemeChange() {
    settingsStore.watch(['useDarkMode', 'lightTheme', 'darkTheme'], applyTheme)
}

export function applyTheme() {
    const useDarkMode = settingsStore.get('useDarkMode')
    const lightTheme = settingsStore.get('lightTheme')
    const darkTheme = settingsStore.get('darkTheme')

    const theme = getTheme(useDarkMode ? darkTheme : lightTheme)
    const additionalColors = {
        'accent-lighten': tinycolor(theme.accent).lighten(10).toString(),
        'accent-darken': tinycolor(theme.accent).darken(10).toString(),
        'accent-background': tinycolor(theme.accent).setAlpha(0.15).toString(),
    }

    Object.assign(theme, additionalColors)

    Object.entries(theme).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--color-${key}`, value)
    })
}