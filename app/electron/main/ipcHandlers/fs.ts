import { app, dialog, ipcMain } from "electron";
import { IPC_CHANNELS } from "../../ipcChannels";
import { FsAPIAddTempImageFn, FsAPILoadImageBase64Fn } from "@/type/preload-api";

import fs from "fs";
import fsp from "fs/promises";
import sizeOf from "image-size";

import path from "path";
import os from "os";
import { nanoid } from "@reduxjs/toolkit";

export function registerFsHandlers() {
    const TEMP_DIR = path.join(os.tmpdir(), app.getName());
    const TEMP_IMAGES_DIR = path.join(TEMP_DIR, "images");

    ipcMain.handle(
        IPC_CHANNELS.FS.LOAD_IMAGE_BASE64,
        async (_event, ...args: Parameters<FsAPILoadImageBase64Fn>): ReturnType<FsAPILoadImageBase64Fn> => {
            const [filePath] = args;

            const buffer = fs.readFileSync(filePath);
            const base64 = buffer.toString("base64");

            // Определяем MIME по расширению
            const ext = filePath.split(".").pop()?.toLowerCase();
            const mime = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : ext === "webp" ? "image/webp" : "image/png";

            return `data:${mime};base64,${base64}`;
        }
    );

    ipcMain.handle(
        IPC_CHANNELS.FS.ADD_TEMP_IMAGE,
        async (_event, ..._args: Parameters<FsAPIAddTempImageFn>): ReturnType<FsAPIAddTempImageFn> => {
            const { canceled, filePaths } = await dialog.showOpenDialog({
                title: "Выберите изображение",
                filters: [
                    {
                        name: "Изображения",
                        extensions: ["png", "jpg", "jpeg", "webp"],
                    },
                ],
                properties: ["openFile"],
            });

            if (canceled || filePaths.length === 0) throw new Error("Invalid image file");

            const dialogPath = filePaths[0];
            await fsp.mkdir(TEMP_IMAGES_DIR, { recursive: true });

            // Собираем данные
            const id = nanoid();
            const ext = path.extname(dialogPath);
            const base = path.basename(dialogPath, ext);
            const name = base + ext;
            const fileName = `${base}_${id}${ext}`;
            const tempPath = path.join(TEMP_IMAGES_DIR, fileName);
            const relPath = `images/${fileName}`;

            await fsp.copyFile(dialogPath, tempPath);

            const buffer = fs.readFileSync(dialogPath);
            const { width, height } = sizeOf(buffer);

            return { id, tempPath, relPath, name, width, height };
        }
    );
}
