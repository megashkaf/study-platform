import { ElectronAPI } from "@/type/preload-api";
import { IPC_CHANNELS } from "../../ipcChannels";

import { BrowserWindow, desktopCapturer, dialog, ipcMain, Menu } from "electron";

import path from "path";

export function registerElectronHandlers() {
    ipcMain.on(
        IPC_CHANNELS.ELECTRON.SET_WINDOW_TITLE,
        async (event, ...args: Parameters<ElectronAPI["setWindowTitle"]>) => {
            const [title] = args;
            const win = BrowserWindow.fromWebContents(event.sender);
            if (win) win.setTitle(title);
        },
    );

    ipcMain.on(
        IPC_CHANNELS.ELECTRON.UPDATE_PROJECT_STATE_DIRTY,
        async (_event, ...args: Parameters<ElectronAPI["updateProjectStateDirty"]>) => {
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
        },
    );

    ipcMain.handle(
        IPC_CHANNELS.ELECTRON.GET_WINDOWS,
        async (_event, ..._args: Parameters<ElectronAPI["getWindows"]>): ReturnType<ElectronAPI["getWindows"]> => {
            const sources = await desktopCapturer.getSources({
                types: ["window"],
            });
            return sources.map((source) => ({
                id: source.id,
                name: source.name,
            }));
        },
    );

    ipcMain.handle(
        IPC_CHANNELS.ELECTRON.SHOW_SAVE_AS_DIALOG,
        async (
            _event,
            ..._args: Parameters<ElectronAPI["showSaveAsDialog"]>
        ): ReturnType<ElectronAPI["showSaveAsDialog"]> => {
            // Указываем путь и название файла
            const { canceled, filePath } = await dialog.showSaveDialog({
                title: "Сохранить проект",
                filters: [{ name: "Project", extensions: ["zip"] }],
            });
            if (canceled || !filePath) return;

            const fileName = path.basename(filePath);

            return { filePath, fileName };
        },
    );
}
