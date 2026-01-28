export const IPC_CHANNELS = {
    ELECTRON: {
        SET_WINDOW_TITLE: "electron:setWindowTitle",
        UPDATE_PROJECT_STATE_DIRTY: "electron:updateProjectStateDirty",
        GET_WINDOWS: "electron:getWindows",
        SHOW_SAVE_AS_DIALOG: "electron:showSaveAsDialog",
    },
    FS: {
        LOAD_IMAGE_BASE64: "fs:load-image-base64",
        ADD_TEMP_IMAGE: "fs:add-temp-image",
    },
    MENU: {
        NEW_PROJECT: "menu:new-project",
        SAVE_PROJECT: "menu:save-project",
        SAVE_PROJECT_AS: "menu:save-project-as",
        OPEN_PROJECT: "menu:load-project",
    },
    PROJECT: {
        NEW: "project:new",
        SAVE: "project:save",
        OPEN: "project:open",
    },
    SCREENSHOT: {
        CAPTURE_WINDOW: "screenshot:capture-window",
    },
} as const;
