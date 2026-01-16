import { nanoid, PayloadAction, WritableDraft } from "@reduxjs/toolkit";
import {
    addLayerReducer,
    defaultLayerDatas,
    removeLayerReducer,
} from "./layer";
import { EditorState, SlideItem } from "../types";

export const addSlideData = (): SlideItem => ({
    id: nanoid(),
    layerIds: [],
});

export const addSlideReducer = (state: WritableDraft<EditorState>) => {
    const slide = addSlideData();

    // Добавляем слайд в общий список
    state.presentation.slides.byId[slide.id] = slide;
    state.presentation.slides.allIds.push(slide.id);

    // Обновляем активные объекты
    state.activeSlideId = slide.id;
    state.activeNodeId = null;

    // Создаем пустые слои
    defaultLayerDatas.map((data) => {
        const { type, name } = data;
        addLayerReducer(state, {
            type: "manual/addLayer",
            payload: { type, name },
        });
    });

    // Разрешаем сохранение
    state.projectState.isDirty = true;
};

export const removeSlideReducer = (
    state: WritableDraft<EditorState>,
    action: PayloadAction<string>
) => {
    const slideId = action.payload;
    const slide = state.presentation.slides.byId[slideId];

    // Если такого слайда нет или в презентации всего 1 слайд, ничего не делаем
    if (!slide || state.presentation.slides.allIds.length <= 1) return;

    // Убираем все слои слайда
    slide.layerIds.forEach((itemId) => {
        removeLayerReducer(state, {
            type: "manual/removeLayer",
            payload: itemId,
        });
    });

    // Убираем слайд
    delete state.presentation.slides.byId[slideId];
    state.presentation.slides.allIds = state.presentation.slides.allIds.filter(
        (id) => id !== slideId
    );

    // Сбрасываем активные элементы
    if (state.activeSlideId === slideId) {
        state.activeSlideId = null;
        state.activeLayerId = null;
        state.activeNodeId = null;

        // Назначаем активным другой слайд
        const currentIndex = state.presentation.slides.allIds.indexOf(slideId);
        const nextSlideId =
            state.presentation.slides.allIds[currentIndex + 1] || // Следующий слайд
            state.presentation.slides.allIds[currentIndex - 1]; // Предыдущий слайд

        selectSlideReducer(state, {
            type: "manual/selectSlide",
            payload: nextSlideId,
        });
    }
};

export const reorderSlidesReducer = (
    state: WritableDraft<EditorState>,
    action: PayloadAction<{ oldIndex: number; newIndex: number }>
) => {
    const { oldIndex, newIndex } = action.payload;
    const allIds = state.presentation.slides.allIds;
    const [moved] = allIds.splice(oldIndex, 1);
    allIds.splice(newIndex, 0, moved);

    // Разрешаем сохранение
    state.projectState.isDirty = true;
};

export const selectSlideReducer = (
    state: WritableDraft<EditorState>,
    action: PayloadAction<string>
) => {
    const slideId = action.payload;
    const slide = state.presentation.slides.byId[slideId];

    // Обновляем активные объекты
    state.activeSlideId = slideId;
    state.activeLayerId = slide.layerIds[0];
    state.activeNodeId = null;
};
