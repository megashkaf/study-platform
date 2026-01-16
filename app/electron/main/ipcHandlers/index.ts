import { registerElectronHandlers } from "./electron";
import { registerFsHandlers } from "./fs";
import { registerProjectHandlers } from "./project";

export function registerIpcHandlers() {
    registerElectronHandlers();
    registerFsHandlers();
    registerProjectHandlers();
}
