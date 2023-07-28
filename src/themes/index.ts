import Default from './default.json'
import NordDark from './nord-dark.json'
import Apricot from './apricot.json'

export type Theme = typeof Default

export const darkThemes: Record<string, Theme> = {
    NordDark,
}

export const lightThemes: Record<string, Theme> = {
    Apricot,
}

export const themes = Object.assign({}, darkThemes, lightThemes)

export function getTheme(name: string) {
    return themes[name]
}