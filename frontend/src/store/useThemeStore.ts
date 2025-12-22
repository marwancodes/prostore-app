import {create} from "zustand";

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("preferred-theme") || "business",
    setTheme: (theme: string) => {
        localStorage.setItem("preferred-theme", theme);
        set({theme});
    },
}));