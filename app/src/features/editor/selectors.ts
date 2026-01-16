import { RootState } from "@/store";
import { SlideItem, LayerItem, AnyNodeItem } from "./types";
import { createSelector } from "@reduxjs/toolkit";

// --------- Editor settings ---------
export const selectPresentation = (state: RootState) =>
    state.editor.presentation;

export const selectPresentationTitle = (state: RootState) =>
    state.editor.presentation.title || "Новая презентация";

export const selectCanvasScale = (state: RootState) => state.editor.canvasScale;

export const selectAllActiveIds = createSelector(
    [
        (state: RootState) => state.editor.activeSlideId,
        (state: RootState) => state.editor.activeLayerId,
        (state: RootState) => state.editor.activeNodeId,
    ],
    (activeSlideId, activeLayerId, activeNodeId) => ({
        activeSlideId,
        activeLayerId,
        activeNodeId,
    })
);

// --------- Slides ---------
// All
export const selectAllSlideIds = (state: RootState) =>
    state.editor.presentation.slides.allIds;

export const selectAllSlides = createSelector(
    (state: RootState) => state.editor.presentation.slides.byId,
    selectAllSlideIds,
    (byId, allIds): SlideItem[] => allIds.map((id: string) => byId[id])
);

// Specific
export const selectActiveSlide = (state: RootState) => {
    const activeSlideId = state.editor.activeSlideId;
    if (!activeSlideId) return;

    const slide = state.editor.presentation.slides.byId[activeSlideId];
    return slide;
};

// --------- Layers ---------
// All
export const selectAllLayerIds = (state: RootState) =>
    state.editor.presentation.layers.allIds;

export const selectAllLayers = createSelector(
    (state: RootState) => state.editor.presentation.layers.byId,
    selectAllLayerIds,
    (byId, allIds): LayerItem[] => allIds.map((id: string) => byId[id])
);

// Specific
export const selectActiveLayer = (state: RootState) => {
    const activeLayerId = state.editor.activeLayerId;
    if (!activeLayerId) return;

    const layer = state.editor.presentation.layers.byId[activeLayerId];
    return layer;
};

export const selectActiveLayerType = createSelector(
    [selectActiveLayer],
    (layer) => layer?.type
);

export const selectActiveSlideLayerIds = createSelector(
    [selectActiveSlide],
    (slide) => (slide ? slide.layerIds : [])
);

export const selectActiveSlideLayers = createSelector(
    [
        (state: RootState) => state.editor.presentation.layers.byId,
        selectActiveSlideLayerIds,
    ],
    (allLayers, layerIds): LayerItem[] => {
        return layerIds.map((id: string) => allLayers[id]).filter(Boolean);
    }
);

// --------- Nodes ---------
// All
export const selectAllNodeIds = (state: RootState) =>
    state.editor.presentation.nodes.allIds;

export const selectAllNodes = createSelector(
    (state: RootState) => state.editor.presentation.nodes.byId,
    selectAllNodeIds,
    (byId, allIds): AnyNodeItem[] => allIds.map((id: string) => byId[id])
);

// Specific
export const selectActiveSlideNodeIds = createSelector(
    [selectActiveSlideLayers],
    (layers) => {
        if (layers.length === 0) return [];

        return layers.flatMap((layer) => layer.nodeIds);
    }
);
export const selectActiveSlideNodes = createSelector(
    [
        (state: RootState) => state.editor.presentation.nodes.byId,
        selectActiveSlideNodeIds,
    ],
    (allNodes, nodeIds): AnyNodeItem[] => {
        return nodeIds.map((id: string) => allNodes[id]).filter(Boolean);
    }
);

export const selectActiveLayerNodeIds = createSelector(
    [selectActiveLayer],
    (layer) => (layer ? layer.nodeIds : [])
);

export const selectActiveLayerNodes = createSelector(
    [
        (state: RootState) => state.editor.presentation.nodes.byId,
        selectActiveLayerNodeIds,
    ],
    (allNodes, nodeIds): AnyNodeItem[] => {
        return nodeIds.map((id: string) => allNodes[id]).filter(Boolean);
    }
);

// export const selectNodesByActiveSlideLayers = createSelector([],

// );

// --------- ProjectState ---------
export const selectProjectState = createSelector(
    [
        (state: RootState) => state.editor.projectState.filePath,
        (state: RootState) => state.editor.projectState.isDirty,
        (state: RootState) => state.editor.projectState.isDialogOpen,
    ],
    (filePath, isDirty, isDialogOpen) => ({
        filePath,
        isDirty,
        isDialogOpen,
    })
);
