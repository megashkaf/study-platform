import { ScreenshotAPI } from "@/type/preload-api";
import { IPC_CHANNELS } from "../../ipcChannels";

import { app, dialog, ipcMain } from "electron";

import path from "path";
import os from "os";
import fs from "fs/promises";
import { Monitor, Window } from "node-screenshots";

const screenshotsDir = path.join(app.getPath("pictures"), "TEST");

export function registerScreenshotHandlers() {
    ipcMain.handle(
        IPC_CHANNELS.SCREENSHOT.CAPTURE_WINDOW,
        async (_event, ...args: Parameters<ScreenshotAPI["captureWindow"]>) => {
            let windows = Window.all();
            console.log(windows);

            // windows.forEach(async (item) => {
            //     console.log({
            //         id: item.id,
            //         x: item.x,
            //         y: item.y,
            //         width: item.width,
            //         height: item.height,
            //         // rotation: item.rotation,
            //         // scaleFactor: item.scaleFactor,
            //         // isPrimary: item.isPrimary,
            //     });

            //     const data = await item.captureImage();
            //     const cropped = await data.crop(10, 10, 10, 10);
            //     const pngPath = path.join(screenshotsDir, `${item.id}.png`);
            //     await fs.writeFile(pngPath, await cropped.toPng());
            // });

            console.log(2);
        },
    );
}
