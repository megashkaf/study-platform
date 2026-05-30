import { PayloadAction, WritableDraft } from "@reduxjs/toolkit";
import { EditorState } from "../types";

export const setPlayerVisibilityReducer = (state: WritableDraft<EditorState>, action: PayloadAction<boolean>) => {
    state.player.isVisible = action.payload;
};
export const startPlayerReducer = (state: WritableDraft<EditorState>, _action: PayloadAction) => {
    const firstSlideId = state.presentation.slides.allIds[0];
    const slide = state.presentation.slides.byId[firstSlideId];

    state.activeSlideId = firstSlideId;
    state.activeLayerId = slide.layerIds[0];
    state.activeNodeId = null;

    state.player = {
        isVisible: true,
        localMistakes: 0,
        globalMistakes: 0,
    };
};

export const selectNextSlideReducer = (state: WritableDraft<EditorState>) => {
    const activeSlideId = state.activeSlideId;
    if (!activeSlideId) return;

    const activeSlideIndex = state.presentation.slides.allIds.findIndex((v) => v === activeSlideId);

    const nextSlideId = state.presentation.slides.allIds[activeSlideIndex + 1];

    if (!nextSlideId) {
        // Конец презентации
        const sessionData = {
            user: "Тестовый ученик",
            mistakes: state.player.globalMistakes,
            actions: [],
        };
        console.log(sessionData);

        state.player = {
            isVisible: false,
            localMistakes: 0,
            globalMistakes: 0,
        };
    } else {
        // Включить следующий слайд
        const nextSlide = state.presentation.slides.byId[nextSlideId];

        state.activeSlideId = nextSlideId;
        state.activeLayerId = nextSlide.layerIds[0];
        state.activeNodeId = null;

        state.player.localMistakes = 0;
    }
};

export const addMistakeReducer = (state: WritableDraft<EditorState>) => {
    state.player.localMistakes++;
    state.player.globalMistakes++;
};
