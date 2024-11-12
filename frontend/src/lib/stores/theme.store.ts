import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type ThemeType = "dark" | "light";
type State = {
	theme: ThemeType;
};

type Action = {
	updateTheme: (theme: State["theme"]) => void;
};

export const useThemeStore = create<State & Action>()(
	persist(
		(set, get) => ({
			theme: "light",
			updateTheme(theme: ThemeType) {
				set({ theme });
			},
		}),
		{
			name: "syscrack__theme-storage",
			storage: createJSONStorage(() => localStorage),
		},
	),
);
