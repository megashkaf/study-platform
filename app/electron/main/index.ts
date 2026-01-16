import { app, BrowserWindow, shell, ipcMain, Menu } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import os from "node:os";
import fsp from "fs/promises";
import { update } from "./update";
import { menuTemplate } from "./menu";

import installExtension, {
    REDUX_DEVTOOLS,
    REACT_DEVELOPER_TOOLS,
} from "electron-devtools-installer";

import { registerIpcHandlers } from "./ipcHandlers";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TEMP_DIR = path.join(os.tmpdir(), app.getName());

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.mjs   > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.APP_ROOT = path.join(__dirname, "../..");

export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
    ? path.join(process.env.APP_ROOT, "public")
    : RENDERER_DIST;

// Disable GPU Acceleration for Windows 7
if (os.release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
    app.quit();
    process.exit(0);
}

let win: BrowserWindow | null = null;
const preload = path.join(__dirname, "../preload/index.mjs");
const indexHtml = path.join(RENDERER_DIST, "index.html");

async function createWindow() {
    win = new BrowserWindow({
        title: "Main window",
        icon: path.join(process.env.VITE_PUBLIC, "favicon-editor.ico"),
        width: 1280,
        height: 720,
        minWidth: 1280,
        minHeight: 720,
        webPreferences: {
            preload,
        },
    });

    if (VITE_DEV_SERVER_URL) {
        // #298
        win.loadURL(VITE_DEV_SERVER_URL);
        // Open devTool if the app is not packaged
        win.webContents.openDevTools();
    } else {
        win.loadFile(indexHtml);
    }

    // Test actively push message to the Electron-Renderer
    win.webContents.on("did-finish-load", () => {
        win?.webContents.send(
            "main-process-message",
            new Date().toLocaleString()
        );
    });

    // Make all links open with the browser, not with the application
    win.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith("https:")) shell.openExternal(url);
        return { action: "deny" };
    });

    // Auto update
    update(win);
}

app.whenReady().then(async () => {
    // DevTools
    if (!app.isPackaged) {
        installExtension([REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS])
            .then(([redux, react]) =>
                console.log(`Added Extensions:  ${redux.name}, ${react.name}`)
            )
            .catch((err) => console.log("An error occurred: ", err));
    }

    // Подключаем все ipcMain.handle и ipcMain.on
    registerIpcHandlers();

    // Очищаем AppData/Local/app/temp
    await clearTempDir();

    // Создаем окно
    createWindow();

    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
});

app.on("window-all-closed", () => {
    win = null;
    if (process.platform !== "darwin") app.quit();
});

app.on("second-instance", () => {
    if (win) {
        // Focus on the main window if the user tried to open another
        if (win.isMinimized()) win.restore();
        win.focus();
    }
});

app.on("activate", () => {
    const allWindows = BrowserWindow.getAllWindows();
    if (allWindows.length) {
        allWindows[0].focus();
    } else {
        createWindow();
    }
});

// New window example arg: new windows url
// ipcMain.handle("open-win", (_, arg) => {
//     const childWindow = new BrowserWindow({
//         webPreferences: {
//             preload,
//             nodeIntegration: true,
//             contextIsolation: false,
//         },
//     });

//     if (VITE_DEV_SERVER_URL) {
//         childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`);
//     } else {
//         childWindow.loadFile(indexHtml, { hash: arg });
//     }
// });

async function clearTempDir() {
    try {
        await fsp.rm(TEMP_DIR, { recursive: true, force: true });
        await fsp.mkdir(TEMP_DIR, { recursive: true });
        console.log("[temp] cleared");
    } catch (err) {
        console.error("[temp] clear error:", err);
    }
}
