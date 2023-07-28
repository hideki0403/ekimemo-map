import tinycolor from 'tinycolor2'
import { defaultStore } from '@/scripts/store'
import { getTheme } from '@/themes'

export function watchThemeChange() {
    defaultStore.watch(['useDarkMode', 'lightTheme', 'darkTheme'], applyTheme)
}

export function applyTheme() {
    const useDarkMode = defaultStore.get('useDarkMode')
    const lightTheme = defaultStore.get('lightTheme')
    const darkTheme = defaultStore.get('darkTheme')

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