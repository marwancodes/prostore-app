import {create} from "zustand";

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("preferred-theme") || "night",
    setTheme: (theme: string) => {
        localStorage.setItem("preferred-theme", theme);
        set({theme});
    },
}));