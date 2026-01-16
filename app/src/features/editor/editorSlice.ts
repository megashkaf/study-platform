import { createSlice } from "@reduxjs/toolkit";

import {
    addPresentationData,
    addPresentationReducer,
    removePresentationReducer,
    setTitleReducer,
    updatePresentationReducer,
} from "./reducers/presentation";
import {
    addSlideReducer,
    removeSlideReducer,
    reorderSlidesReducer,
    selectSlideReducer,
} from "./reducers/slide";
import {
    addLayerReducer,
    removeLayerReducer,
    reorderLayersReducer,
    selectLayerReducer,
} from "./reducers/layer";
import {
    addNodeReducer,
    removeNodeReducer,
    selectNodeReducer,
    updateNodeReducer,
} from "./reducers/node";
import { zoomInReducer, zoomOutReducer } from "./reducers/canvas";
import { setProjectStateReducer } from "./reducers/projectState";

const presentationSlice = createSlice({
    name: "presentation",
    initialState: addPresentationData(),
    reducers: {
        // --------- Presentation ---------
        addPresentation: addPresentationReducer,
        updatePresentation: updatePresentationReducer,
        removePresentation: removePresentationReducer,
        setTitle: setTitleReducer,

        // --------- Slides ---------
        addSlide: addSlideReducer,
        removeSlide: removeSlideReducer,
        reorderSlides: reorderSlidesReducer,
        selectSlide: selectSlideReducer,

        // --------- Layers ---------
        addLayer: addLayerReducer,
        removeLayer: removeLayerReducer,
        reorderLayers: reorderLayersReducer,
        selectLayer: selectLayerReducer,

        // --------- Nodes ---------
        addNode: addNodeReducer,
        updateNode: updateNodeReducer,
        removeNode: removeNodeReducer,
        selectNode: selectNodeReducer,

        // --------- Canvas ---------
        zoomIn: zoomInReducer,
        zoomOut: zoomOutReducer,

        // --------- ProjectState ---------
        updateProjectState: setProjectStateReducer,
    },
});

export const actions = presentationSlice.actions;

export default presentationSlice.reducer;
