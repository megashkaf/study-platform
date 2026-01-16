import { PayloadAction, WritableDraft } from "@reduxjs/toolkit";
import { EditorState } from "../types";

export const zoomInReducer = (
    state: WritableDraft<EditorState>,
    action: PayloadAction<number>
) => {
    const newValue = +(state.canvasScale + action.payload).toFixed(10);
    if (newValue >= 1.6) return;
    state.canvasScale = newValue;
};

export const zoomOutReducer = (
    state: WritableDraft<EditorState>,
    action: PayloadAction<number>
) => {
    const newValue = +(state.canvasScale - action.payload).toFixed(10);
    if (newValue <= 0) return;
    state.canvasScale = newValue;
};
