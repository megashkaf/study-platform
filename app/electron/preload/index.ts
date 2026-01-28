import { ipcRenderer, contextBridge } from "electron";
import { ElectronAPI, FsAPI, MenuAPI, ProjectAPI, ScreenshotAPI } from "@/type/preload-api";
import { IPC_CHANNELS } from "../ipcChannels";

// --------- Context bridge ---------
const electronAPI: ElectronAPI = {
    setWindowTitle: (title) => ipcRenderer.send(IPC_CHANNELS.ELECTRON.SET_WINDOW_TITLE, title),
    updateProjectStateDirty: (isDirty) => ipcRenderer.send(IPC_CHANNELS.ELECTRON.UPDATE_PROJECT_STATE_DIRTY, isDirty),
    getWindows: () => ipcRenderer.invoke(IPC_CHANNELS.ELECTRON.GET_WINDOWS),
    showSaveAsDialog: () => ipcRenderer.invoke(IPC_CHANNELS.ELECTRON.SHOW_SAVE_AS_DIALOG),
};
contextBridge.exposeInMainWorld("electronAPI", electronAPI);

const fsAPI: FsAPI = {
    loadImageBase64: (path) => ipcRenderer.invoke(IPC_CHANNELS.FS.LOAD_IMAGE_BASE64, path),
    addTempImage: () => ipcRenderer.invoke(IPC_CHANNELS.FS.ADD_TEMP_IMAGE),
};
contextBridge.exposeInMainWorld("fsAPI", fsAPI);

const menuAPI: MenuAPI = {
    onNewProject: (callback) => {
        const listener = () => callback();
        ipcRenderer.on(IPC_CHANNELS.MENU.NEW_PROJECT, listener);
        return () => ipcRenderer.off(IPC_CHANNELS.MENU.NEW_PROJECT, listener);
    },
    onSaveProject: (callback) => {
        const listener = () => callback();
        ipcRenderer.on(IPC_CHANNELS.MENU.SAVE_PROJECT, listener);
        return () => ipcRenderer.off(IPC_CHANNELS.MENU.SAVE_PROJECT, listener);
    },
    onSaveProjectAs: (callback) => {
        const listener = () => callback();
        ipcRenderer.on(IPC_CHANNELS.MENU.SAVE_PROJECT_AS, listener);
        return () => ipcRenderer.off(IPC_CHANNELS.MENU.SAVE_PROJECT_AS, listener);
    },
    onOpenProject: (callback) => {
        const listener = () => callback();
        ipcRenderer.on(IPC_CHANNELS.MENU.OPEN_PROJECT, listener);
        return () => ipcRenderer.off(IPC_CHANNELS.MENU.OPEN_PROJECT, listener);
    },
};
contextBridge.exposeInMainWorld("menuAPI", menuAPI);

export const projectAPI: ProjectAPI = {
    save: (presentation, title, filePath) =>
        ipcRenderer.invoke(IPC_CHANNELS.PROJECT.SAVE, presentation, title, filePath),
    open: () => ipcRenderer.invoke(IPC_CHANNELS.PROJECT.OPEN),
};
contextBridge.exposeInMainWorld("projectAPI", projectAPI);

export const screenshotAPI: ScreenshotAPI = {
    captureWindow: () => ipcRenderer.invoke(IPC_CHANNELS.SCREENSHOT.CAPTURE_WINDOW),
};
contextBridge.exposeInMainWorld("screenshotAPI", screenshotAPI);

// --------- Preload scripts loading ---------
function domReady(condition: DocumentReadyState[] = ["complete", "interactive"]) {
    return new Promise((resolve) => {
        if (condition.includes(document.readyState)) {
            resolve(true);
        } else {
            document.addEventListener("readystatechange", () => {
                if (condition.includes(document.readyState)) {
                    resolve(true);
                }
            });
        }
    });
}

const safeDOM = {
    append(parent: HTMLElement, child: HTMLElement) {
        if (!Array.from(parent.children).find((e) => e === child)) {
            return parent.appendChild(child);
        }
    },
    remove(parent: HTMLElement, child: HTMLElement) {
        if (Array.from(parent.children).find((e) => e === child)) {
            return parent.removeChild(child);
        }
    },
};

// --------- Loading spinner ---------
function useLoading() {
    const className = `loaders-css__square-spin`;
    const styleContent = `
@keyframes square-spin {
  25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
  50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
  75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
  100% { transform: perspective(100px) rotateX(0) rotateY(0); }
}
.${className} > div {
  animation-fill-mode: both;
  width: 50px;
  height: 50px;
  background: #fff;
  animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}
.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #282c34;
  z-index: 9;
}
    `;
    const oStyle = document.createElement("style");
    const oDiv = document.createElement("div");

    oStyle.id = "app-loading-style";
    oStyle.innerHTML = styleContent;
    oDiv.className = "app-loading-wrap";
    oDiv.innerHTML = `<div class="${className}"><div></div></div>`;

    return {
        appendLoading() {
            safeDOM.append(document.head, oStyle);
            safeDOM.append(document.body, oDiv);
        },
        removeLoading() {
            safeDOM.remove(document.head, oStyle);
            safeDOM.remove(document.body, oDiv);
        },
    };
}

// ----------------------------------------------------------------------

const { appendLoading, removeLoading } = useLoading();
domReady().then(appendLoading);

window.onmessage = (ev) => {
    ev.data.payload === "removeLoading" && removeLoading();
};

setTimeout(removeLoading, 4999);
