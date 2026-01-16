import { PayloadAction, WritableDraft } from "@reduxjs/toolkit";
import { EditorState } from "../types";

export interface SetProjectStatePayload {
    filePath?: string | null;
    isDirty?: boolean;
    isDialogOpen?: boolean;
}

export const setProjectStateReducer = (
    state: WritableDraft<EditorState>,
    action: PayloadAction<SetProjectStatePayload>
) => {
    Object.entries(action.payload).forEach(([key, value]) => {
        if (value !== undefined) (state.projectState as any)[key] = value;
    });
};
