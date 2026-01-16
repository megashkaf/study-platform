export const IPC_CHANNELS = {
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
    ELECTRON: {
        GET_WINDOWS: "electron:get-windows",
        SET_WINDOW_TITLE: "electron:set-window-title",
        UPDATE_PROJECT_STATE_DIRTY: "electron:update-project-state-dirty",
        SHOW_SAVE_AS_DIALOG: "electron:show-save-dialog",
    },
    FS: {
        LOAD_IMAGE_BASE64: "fs:load-image-base64",
        ADD_TEMP_IMAGE: "fs:add-temp-image",
    },
} as const;
