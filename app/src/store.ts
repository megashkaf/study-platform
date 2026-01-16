import { configureStore } from "@reduxjs/toolkit";
import { themeReducer, editorReducer } from "@features";

export const store = configureStore({
    reducer: {
        theme: themeReducer,
        editor: editorReducer,
    },
    devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
