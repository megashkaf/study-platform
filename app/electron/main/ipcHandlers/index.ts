import { registerElectronHandlers } from "./electron";
import { registerFsHandlers } from "./fs";
import { registerProjectHandlers } from "./project";
import { registerScreenshotHandlers } from "./screenshot";

export function registerIpcHandlers() {
    registerElectronHandlers();
    registerFsHandlers();
    registerProjectHandlers();
    registerScreenshotHandlers();
}
