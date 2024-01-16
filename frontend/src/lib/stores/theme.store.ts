import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const themeAtom = atomWithStorage('theme', 'dark')
export const modifyThemeAtom = atom(
	(get) => get(themeAtom),
	(_get, set, newTheme: string) => set(themeAtom, newTheme)
)