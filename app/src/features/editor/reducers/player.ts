import { PayloadAction, WritableDraft } from "@reduxjs/toolkit";
import { EditorState } from "../types";

export const setPlayerStateReducer = (state: WritableDraft<EditorState>, action: PayloadAction<boolean>) => {
    state.player.isVisible = action.payload;
};
