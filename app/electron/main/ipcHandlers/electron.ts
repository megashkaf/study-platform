import { BrowserWindow, desktopCapturer, dialog, ipcMain, Menu } from "electron";
import { IPC_CHANNELS } from "../../ipcChannels";
import {
    ElectronAPIGetWindowsFn,
    ElectronAPISetWindowTitleFn,
    ElectronAPIShowSaveAsDialogFn,
    ElectronAPPIUpdateProjectStateDirtyFn,
} from "@/type/preload-api";

import path from "path";

export function registerElectronHandlers() {
    // Rename window title
    ipcMain.on(
        IPC_CHANNELS.ELECTRON.SET_WINDOW_TITLE,
        async (event, ...args: Parameters<ElectronAPISetWindowTitleFn>) => {
            const [title] = args;
            const win = BrowserWindow.fromWebContents(event.sender);
            if (win) win.setTitle(title);
        }
    );

    ipcMain.on(
        IPC_CHANNELS.ELECTRON.UPDATE_PROJECT_STATE_DIRTY,
        async (_event, ...args: Parameters<ElectronAPPIUpdateProjectStateDirtyFn>) => {
            const [isDirty] = args;
            const menu = Menu.getApplicationMenu();
            if (!menu) return;

            const saveItem = menu.getMenuItemById("saveProject");
            if (saveItem) {
                saveItem.enabled = isDirty;
            }

            const saveAsItem = menu.getMenuItemById("saveProjectAs");
            if (saveAsItem) {
                saveAsItem.enabled = isDirty;
            }
        }
    );

    // Get all opened windows
    ipcMain.handle(
        IPC_CHANNELS.ELECTRON.GET_WINDOWS,
        async (_event, ..._args: Parameters<ElectronAPIGetWindowsFn>): ReturnType<ElectronAPIGetWindowsFn> => {
            const sources = await desktopCapturer.getSources({ types: ["window"] });
            return sources.map((source) => ({ id: source.id, name: source.name }));
        }
    );

    ipcMain.handle(
        IPC_CHANNELS.ELECTRON.SHOW_SAVE_AS_DIALOG,
        async (
            _event,
            ..._args: Parameters<ElectronAPIShowSaveAsDialogFn>
        ): ReturnType<ElectronAPIShowSaveAsDialogFn> => {
            // Указываем путь и название файла
            const { canceled, filePath } = await dialog.showSaveDialog({
                title: "Сохранить проект",
                filters: [{ name: "Project", extensions: ["zip"] }],
            });
            if (canceled || !filePath) return;

            const fileName = path.basename(filePath);

            return { filePath, fileName };
        }
    );
}
