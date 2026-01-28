import { ProjectAPI } from "@/type/preload-api";
import { IPC_CHANNELS } from "../../ipcChannels";

import { app, dialog, ipcMain } from "electron";
import { AnyNodeItem, Presentation } from "@/features/editor/types";

import path from "path";
import os from "os";
import fs from "fs/promises";

import AdmZip from "adm-zip";

export function registerProjectHandlers() {
    const TEMP_DIR = path.join(os.tmpdir(), app.getName());
    const TEMP_IMAGES_DIR = path.join(TEMP_DIR, "images");

    // Убедимся, что tempDir существует
    async function clearTempDir() {
        try {
            await fs.rm(TEMP_DIR, { recursive: true, force: true });
        } catch (err) {
            console.error("Failed to clear temp dir:", err);
        }
    }

    async function ensureTempDir() {
        await clearTempDir();
        await fs.mkdir(TEMP_IMAGES_DIR, { recursive: true });
    }

    // --------- Save ---------
    ipcMain.handle(
        IPC_CHANNELS.PROJECT.SAVE,
        async (_event, ...args: Parameters<ProjectAPI["save"]>): ReturnType<ProjectAPI["save"]> => {
            const [presentation, title, filePath] = args;
            const zip = new AdmZip();

            // Обновляем название
            if (title) presentation.title = title;

            // Добавляем meta.json
            const metaJson = JSON.stringify(presentation, null, 2);
            zip.addFile("meta.json", Buffer.from(metaJson, "utf-8"));

            // Копируем все изображения из temp в zip/images
            for (const node of Object.values(presentation.nodes.byId) as AnyNodeItem[]) {
                if (node.type === "image" && node.tempPath) {
                    const imageData = await fs.readFile(node.tempPath);
                    zip.addFile(node.relPath, imageData);
                }
            }

            // Сохраняем
            zip.writeZip(filePath);
        },
    );

    // --------- Open ---------
    ipcMain.handle(
        IPC_CHANNELS.PROJECT.OPEN,
        async (_event, ..._args: Parameters<ProjectAPI["open"]>): ReturnType<ProjectAPI["open"]> => {
            const { canceled, filePaths } = await dialog.showOpenDialog({
                title: "Открыть проект",
                filters: [{ name: "Project", extensions: ["zip"] }],
                properties: ["openFile"],
            });
            if (canceled || !filePaths.length) throw new Error("Не удалось получить путь к файлу!");

            const filePath = filePaths[0];
            const zip = new AdmZip(filePath);

            // Ищем meta.json
            const metaEntry = zip.getEntry("meta.json");
            if (!metaEntry) throw new Error("meta.json not found in project archive");

            const metaData = zip.readAsText(metaEntry);
            const presentation: Presentation = JSON.parse(metaData);

            // Извлекаем изображения в temp
            await ensureTempDir();
            for (const node of Object.values(presentation.nodes.byId)) {
                if (node.type === "image") {
                    const imageEntry = zip.getEntry(node.relPath);
                    if (!imageEntry) continue;

                    const tempPath = path.join(TEMP_DIR, "images", path.basename(node.relPath));
                    await fs.writeFile(tempPath, imageEntry.getData());
                }
            }

            return { filePath, presentation };
        },
    );
}
