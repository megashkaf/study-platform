/// <reference types="vite/client" />

import "./types/preload-api";

declare global {
    interface Window {
        electronAPI: ElectronAPI;
        // screenshotAPI: ScreenshotAPI;
        fsAPI: FsAPI;
        menuAPI: MenuAPI;
        projectAPI: ProjectAPI;
    }
}
