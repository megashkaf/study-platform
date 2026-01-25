import { nanoid, PayloadAction, WritableDraft } from "@reduxjs/toolkit";
import { EditorState, LayerItem, LayerType } from "../types";
import { removeNodeReducer } from "./node";

export interface AddLayerPayload {
    type: LayerType;
    name?: string;
}
export interface ReorderLayersPayload {
    oldIndex: number;
    newIndex: number;
}
export const defaultLayerDatas: AddLayerPayload[] = [
    { type: "input", name: "Ввод" },
    { type: "hints", name: "Подсказки" },
    { type: "info", name: "Информация" },
    { type: "background", name: "Фон" },
];

export const addLayerData = (
    slideId: string,
    type: LayerType,
    name: string = "Новый слой",
): LayerItem => ({
    id: nanoid(),
    slideId,
    type,
    name,
    nodeIds: [],
});

export const addLayerReducer = (
    state: WritableDraft<EditorState>,
    action: PayloadAction<AddLayerPayload>,
) => {
    const activeSlideId = state.activeSlideId;
    if (!activeSlideId) return;

    const slide = state.presentation.slides.byId[activeSlideId];
    if (!slide) return;

    const { type, name } = action.payload;
    const layer = addLayerData(activeSlideId, type, name);

    // Добавляем слой в общий список
    state.presentation.layers.byId[layer.id] = layer;
    if (slide.layerIds.length === 0) {
        // Если слайд пустой, просто добавляем слой в конец allIds
        state.presentation.layers.allIds.push(layer.id);
    } else {
        // Иначе добавляем слой перед первым слоем слайда
        const allIdsLayerIndex = state.presentation.layers.allIds.findIndex(
            (id) => id === slide.layerIds[0],
        );
        state.presentation.layers.allIds.splice(allIdsLayerIndex, 0, layer.id);
    }

    // Привязываем к активному слайду
    state.presentation.slides.byId[activeSlideId].layerIds.unshift(layer.id);

    // Обновляем активные объекты
    state.activeLayerId = layer.id;
    state.activeNodeId = null;

    // Разрешаем сохранение
    state.projectState.isDirty = true;
};

export const removeLayerReducer = (
    state: WritableDraft<EditorState>,
    action: PayloadAction<string>,
) => {
    const layerId = action.payload;
    const layer = state.presentation.layers.byId[layerId];
    const layerParentSlide = state.presentation.slides.byId[layer.slideId];

    // Если такого слоя нет или в слайде всего 1 слой, ничего не делаем
    if (!layer || layerParentSlide.layerIds.length <= 1) return;

    // Убираем все node слоя
    layer.nodeIds.forEach((itemId) => {
        removeNodeReducer(state, {
            type: "manual/removeNode",
            payload: itemId,
        });
    });

    // Убираем слой
    delete state.presentation.layers.byId[layerId];
    state.presentation.layers.allIds = state.presentation.layers.allIds.filter(
        (id) => id !== layerId,
    );

    // Убираем ссылку на слой из слайда
    layerParentSlide.layerIds = layerParentSlide.layerIds.filter(
        (id) => id !== layerId,
    );

    // Сбрасываем активные элементы
    if (state.activeLayerId === layerId) {
        state.activeLayerId = null;
        state.activeNodeId = null;
    }
};

export const reorderLayersReducer = (
    state: WritableDraft<EditorState>,
    action: PayloadAction<ReorderLayersPayload>,
) => {
    // Получаем активный слайд
    const activeSlideId = state.activeSlideId;
    if (!activeSlideId) return;

    const slide = state.presentation.slides.byId[activeSlideId];
    if (!slide) return;

    const { oldIndex, newIndex } = action.payload;

    // Меняем порядок во всех слоях
    const allIds = state.presentation.layers.allIds;
    // Смещаем указатель относительно слайда
    const indexOffset = allIds.findIndex((id) => id === slide.layerIds[0]);
    const [moved] = allIds.splice(indexOffset + oldIndex, 1);
    allIds.splice(indexOffset + newIndex, 0, moved);

    // Меняем порядок в активном слайде
    const [slideMoved] = slide.layerIds.splice(oldIndex, 1);
    slide.layerIds.splice(newIndex, 0, slideMoved);

    // Разрешаем сохранение
    state.projectState.isDirty = true;
};

export const selectLayerReducer = (
    state: WritableDraft<EditorState>,
    action: PayloadAction<string>,
) => {
    const layerId = action.payload;

    // Обновляем активные объекты
    state.activeLayerId = layerId;
    state.activeNodeId = null;
};
