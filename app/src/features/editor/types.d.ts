export interface EditorState {
    id: string;
    presentation: Presentation;
    activeSlideId: string | null;
    activeLayerId: string | null;
    activeNodeId: string | null;
    canvasScale: number;
    projectState: {
        filePath: string | null;
        isDirty: boolean;
        isDialogOpen: boolean;
    };
}

interface NormalizedData<T extends { id: string }> {
    byId: Record<string, T>;
    allIds: string[];
}

export interface Presentation {
    title: string;
    slides: NormalizedData<SlideItem>;
    layers: NormalizedData<LayerItem>;
    nodes: NormalizedData<AnyNodeItem>;
}

export interface SlideItem {
    id: string;
    layerIds: string[];
}

export interface LayerItem {
    id: string;
    slideId: string;
    name: string;
    type: LayerType;
    nodeIds: string[];
}

export type LayerType = "background" | "info" | "hints" | "input";

export interface NodeItemBase {
    id: string;
    layerId: string;
    name: string;
    transform: NodeItemTransform;
}
export interface NodeItemTransform {
    width: number;
    height: number;
    x: number;
    y: number;
    rotation: number;
    locked: boolean;
}

export interface ImageNodeItem extends NodeItemBase {
    type: "image";
    tempPath: string;
    relPath: string;
}

export type AnyNodeItem = ImageNodeItem; // | RectNodeItem | InputNodeItem;
