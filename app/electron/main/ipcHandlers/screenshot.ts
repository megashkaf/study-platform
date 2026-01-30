import { ScreenshotAPI } from "@/type/preload-api";
import { IPC_CHANNELS } from "../../ipcChannels";

import { app, dialog, ipcMain } from "electron";

import path from "path";
import os from "os";
import fsp from "fs/promises";

import { Monitor, Window } from "node-screenshots";
import { nanoid } from "@reduxjs/toolkit";

export function registerScreenshotHandlers() {
    const TEMP_DIR = path.join(os.tmpdir(), app.getName());
    const TEMP_IMAGES_DIR = path.join(TEMP_DIR, "images");

    ipcMain.handle(
        IPC_CHANNELS.SCREENSHOT.CAPTURE_WINDOW,
        async (
            _event,
            ...args: Parameters<ScreenshotAPI["captureWindow"]>
        ): ReturnType<ScreenshotAPI["captureWindow"]> => {
            const [windowId] = args;

            if (windowId == null) throw new Error("id is null!");

            const parsedId = parseInt(windowId.split(":")[1], 10); // window:786932:0 -> 786932

            let windows = Window.all();
            let window;

            for (const item of windows) {
                if (item.id != parsedId) continue; // Ищем окно по id
                window = item;
            }
            if (window == undefined) throw new Error("window not found!");

            const image = await window.captureImage();

            // Создаем название
            const id = nanoid();
            const name = `screenshot_${window.id}.png`;
            const tempName = `screenshot_${window.id}_${id}.png`;
            const tempPath = path.join(TEMP_IMAGES_DIR, tempName);
            const relPath = `images/${tempName}`;
            // Сохраняем
            await fsp.mkdir(TEMP_IMAGES_DIR, { recursive: true });
            await fsp.writeFile(tempPath, await image.toPng());
            const { width, height } = window;

            return { id, tempPath, relPath, name, width, height };
        },
    );
}
