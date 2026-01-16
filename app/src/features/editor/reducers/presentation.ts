import { nanoid, PayloadAction, WritableDraft } from "@reduxjs/toolkit";
import { addSlideData } from "./slide";
import { addLayerData, defaultLayerDatas } from "./layer";
import { EditorState, Presentation } from "../types";

export const addPresentationData = (): EditorState => {
    const state: EditorState = {
        id: nanoid(),
        presentation: {
            title: "Новая презентация",
            slides: { byId: {}, allIds: [] },
            layers: { byId: {}, allIds: [] },
            nodes: { byId: {}, allIds: [] },
        },
        activeSlideId: null,
        activeLayerId: null,
        activeNodeId: null,
        canvasScale: 0.5,
        projectState: {
            filePath: null,
            isDirty: true,
            isDialogOpen: false,
        },
    };

    // Создаем слайд
    const slide = addSlideData();

    // Создаём слои, привязываем их к слайду и стейту
    defaultLayerDatas
        .slice()
        .reverse()
        .forEach((data) => {
            const { type, name } = data;

            const layer = addLayerData(slide.id, type, name);

            slide.layerIds.push(layer.id);

            state.presentation.layers.byId[layer.id] = layer;
            state.presentation.layers.allIds.push(layer.id);
        });

    // Привязывааем слайд к стейту
    state.presentation.slides.byId[slide.id] = slide;
    state.presentation.slides.allIds.push(slide.id);

    // Делаем элементы активными
    state.activeSlideId = slide.id;
    state.activeLayerId = state.presentation.layers.allIds[0];

    return state;
};

export const addPresentationReducer = (state: WritableDraft<EditorState>) => {
    const newState = addPresentationData();
    Object.assign(state, newState);
};

export const updatePresentationReducer = (
    state: WritableDraft<EditorState>,
    action: PayloadAction<{
        filePath: string;
        presentation: Presentation;
    }>
) => {
    const { filePath, presentation } = action.payload;

    state.presentation = presentation;

    const firstSlideId = state.presentation.slides.allIds[0];
    const slide = state.presentation.slides.byId[firstSlideId];

    state.activeSlideId = firstSlideId;
    state.activeLayerId = slide.layerIds[0];
    state.activeNodeId = null;

    state.projectState = {
        filePath: filePath,
        isDirty: false,
        isDialogOpen: false,
    };
};

export const removePresentationReducer = (
    state: WritableDraft<EditorState>
) => {
    const newState = addPresentationData();
    Object.assign(state, newState);
};

export const setTitleReducer = (
    state: WritableDraft<EditorState>,
    action: PayloadAction<string>
) => {
    state.presentation.title = action.payload;
    state.projectState.isDirty = true;
};
