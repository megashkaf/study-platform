import { BrowserWindow } from "electron";
import { IPC_CHANNELS } from "../ipcChannels";

function withFocusedWindow(callback: (win: Electron.BrowserWindow) => void) {
    const win = BrowserWindow.getFocusedWindow();
    if (win) callback(win);
}

export const menuTemplate: Electron.MenuItemConstructorOptions[] = [
    {
        label: "File",
        submenu: [
            {
                label: "New",
                accelerator: "CmdOrCtrl+N",
                click: () => withFocusedWindow((win) => win.webContents.send(IPC_CHANNELS.MENU.NEW_PROJECT)),
            },
            {
                label: "Open File",
                accelerator: "CmdOrCtrl+O",
                click: () => withFocusedWindow((win) => win.webContents.send(IPC_CHANNELS.MENU.OPEN_PROJECT)),
            },
            { type: "separator" },
            {
                id: "saveProject",
                label: "Save",
                accelerator: "CmdOrCtrl+S",
                click: () => withFocusedWindow((win) => win.webContents.send(IPC_CHANNELS.MENU.SAVE_PROJECT)),
            },
            {
                id: "saveProjectAs",
                label: "Save As...",
                accelerator: "CmdOrCtrl+Shift+S",
                click: () => withFocusedWindow((win) => win.webContents.send(IPC_CHANNELS.MENU.SAVE_PROJECT_AS)),
            },
        ],
    },
    {
        label: "Edit",
        submenu: [
            {
                label: "Record Actions",
                accelerator: "R",
                click: () => withFocusedWindow((win) => win.webContents.send("menu:record-actions")),
            },
        ],
    },
    {
        label: "Dev",
        submenu: [
            {
                label: "Reload",
                accelerator: "CmdOrCtrl+R",
                click: () => withFocusedWindow((win) => win.reload()),
            },
            {
                label: "Force Reload",
                accelerator: "Ctrl+Shift+R",
                click: () => withFocusedWindow((win) => win.webContents.reloadIgnoringCache()),
            },
            {
                label: "Toggle Developer Tools",
                accelerator: "CmdOrCtrl+Shift+I",
                click: () => withFocusedWindow((win) => win.webContents.toggleDevTools()),
            },
            { type: "separator" },
            {
                label: "Actual Size",
                accelerator: "Ctrl+0",
                click: () => withFocusedWindow((win) => win.webContents.setZoomLevel(0)),
            },
            {
                label: "Zoom In",
                accelerator: "Ctrl+=",
                click: () => {
                    withFocusedWindow((win) => win.webContents.setZoomLevel(win.webContents.getZoomLevel() + 0.5));
                },
            },
            {
                label: "Zoom Out",
                accelerator: "Ctrl+-",
                click: () => {
                    withFocusedWindow((win) => win.webContents.setZoomLevel(win.webContents.getZoomLevel() - 0.5));
                },
            },
            { type: "separator" },
            {
                label: "Toggle Full Screen",
                accelerator: "F11",
                click: () => {
                    withFocusedWindow((win) => win.setFullScreen(!win.isFullScreen()));
                },
            },
        ],
    },
];
