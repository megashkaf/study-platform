// ВХОДНАЯ ТОЧКА (контракт)
// Здесь объявляются методы, которые нужно реализовать в electron/main/ipcHandlers
// Памятка:
// electron/ipcChannels - константы каналов
// electron/preload/index - регистрация методов, которые может использовать renderer
// electron/main/ipcHandlers/index - регистрация обработчиков событий, которые вызвывает renderer

// --------- Electron API ---------
export interface ElectronAPI {
    setWindowTitle(title: string): void;
    updateProjectStateDirty(isDirty: boolean): void;
    getWindows(): Promise<WindowInfo[]>;
    showSaveAsDialog(): Promise<SaveDialogResult | undefined>;
}

// --------- Fs API ---------
export interface FsAPI {
    loadImageBase64(path: string): Promise<string>;
    addTempImage(): Promise<{
        id: string;
        tempPath: string;
        relPath: string;
        name: string;
        width: number;
        height: number;
    }>;
}

// --------- Menu API ---------
export interface MenuAPI {
    onNewProject(callback: () => void): () => void;
    onSaveProject(callback: () => void): () => void;
    onSaveProjectAs(callback: () => void): () => void;
    onOpenProject(callback: () => void): () => void;
}

// --------- Project API ---------
export interface ProjectAPI {
    save(presentation: Presentation, title: string | null, filePath: string): Promise<void>;
    open(): Promise<{ filePath: string; presentation: Presentation }>;
}

// --------- Screenshot API ---------
export interface ScreenshotAPI {
    captureWindow(windowId: string): Promise<{
        id: string;
        tempPath: string;
        relPath: string;
        name: string;
        width: number;
        height: number;
    }>;
}
