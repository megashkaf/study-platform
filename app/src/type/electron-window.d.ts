import { ElectronAPI, FsAPI, MenuAPI, ProjectAPI, ScreenshotAPI } from "./types/preload-api";

declare global {
    interface Window {
        electronAPI: ElectronAPI;
        fsAPI: FsAPI;
        menuAPI: MenuAPI;
        projectAPI: ProjectAPI;
        screenshotAPI: ScreenshotAPI;
    }
}
