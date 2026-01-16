// --------- Electron API ---------
export interface ElectronAPI {
    setWindowTitle: ElectronAPISetWindowTitleFn;
    updateProjectStateDirty: ElectronAPPIUpdateProjectStateDirtyFn;
    getWindows: ElectronAPIGetWindowsFn;
    showSaveAsDialog: ElectronAPIShowSaveAsDialogFn;
}
export type ElectronAPISetWindowTitleFn = (title: string) => void;
export type ElectronAPPIUpdateProjectStateDirtyFn = (isDirty: boolean) => void;
export type ElectronAPIGetWindowsFn = () => Promise<{ id: string; name: string }[]>;
export type ElectronAPIShowSaveAsDialogFn = () => Promise<{ filePath?: string; fileName?: string } | undefined>;

// --------- Screenshot API ---------
// export interface ScreenshotAPI {
//     getScreenshot: () => Promise<string>;
// }

// --------- Fs API ---------
export interface FsAPI {
    loadImageBase64: FsAPILoadImageBase64Fn;
    addTempImage: FsAPIAddTempImageFn;
}
export type FsAPILoadImageBase64Fn = (path: string) => Promise<string>;
export type FsAPIAddTempImageFn = () => Promise<{
    id: string;
    tempPath: string;
    relPath: string;
    name: string;
    width: number;
    height: number;
}>;

// --------- Menu API ---------
export interface MenuAPI {
    onNewProject: MenuAPIOnNewProjectFn;
    onSaveProject: MenuAPIOnSaveProjectFn;
    onSaveProjectAs: MenuAPIOnSaveProjectAsFn;
    onOpenProject: MenuAPIOnOpenProjectFn;
}
export type MenuAPIOnNewProjectFn = (callback: () => void) => () => void;
export type MenuAPIOnSaveProjectFn = (callback: () => void) => () => void;
export type MenuAPIOnSaveProjectAsFn = (callback: () => void) => () => void;
export type MenuAPIOnOpenProjectFn = (callback: () => void) => () => void;

// --------- Project API ---------
export interface ProjectAPI {
    save: ProjectAPISaveFn;
    open: ProjectAPIOpenFn;
}
export type ProjectAPISaveFn = (presentation: Presentation, title: string | null, filePath: string) => Promise<void>;
export type ProjectAPIOpenFn = () => Promise<{ filePath: string; presentation: Presentation }>;
