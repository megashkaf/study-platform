import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Theme = "light" | "dark";

interface ThemeState {
    value: Theme;
}

const initialTheme = ((): Theme => {
    const saved = localStorage.getItem("theme") as Theme;
    document.documentElement.className = saved || "light";
    return saved || "light";
})();

const initialState: ThemeState = {
    value: initialTheme,
};

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<Theme>) => {
            state.value = action.payload;
            document.documentElement.className = state.value;
            localStorage.setItem("theme", state.value);
        },
        toggleTheme: (state) => {
            state.value = state.value === "dark" ? "light" : "dark";
            document.documentElement.className = state.value;
            localStorage.setItem("theme", state.value);
        },
    },
});

export const actions = themeSlice.actions;

export default themeSlice.reducer;
