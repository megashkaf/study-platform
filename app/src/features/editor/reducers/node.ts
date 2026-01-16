import { PayloadAction, WritableDraft } from "@reduxjs/toolkit";
import { AnyNodeItem, EditorState } from "../types";

export const addNodeReducer = (
    state: WritableDraft<EditorState>,
    action: PayloadAction<AnyNodeItem>
) => {
    const node = action.payload;

    // Получаем активный слой
    const activeLayerId = state.activeLayerId;
    if (!activeLayerId) return;

    node.layerId = activeLayerId;

    // Добавляем слой в общий список
    state.presentation.nodes.byId[node.id] = node;
    state.presentation.nodes.allIds.push(node.id);

    // Привязываем к активному слою
    state.presentation.layers.byId[activeLayerId].nodeIds.push(node.id);

    // Обновляем активные объекты
    state.activeNodeId = node.id;

    // Разрешаем сохранение
    state.projectState.isDirty = true;
};

export const updateNodeReducer = (
    state: WritableDraft<EditorState>,
    action: PayloadAction<AnyNodeItem>
) => {
    const updatedNode = action.payload;

    if (!state.presentation.nodes.byId[updatedNode.id]) return;

    console.log(state.presentation.nodes.byId[updatedNode.id]);
    console.log(updatedNode);

    state.presentation.nodes.byId[updatedNode.id] = updatedNode;

    // Разрешаем сохранение
    state.projectState.isDirty = true;
};

export const removeNodeReducer = (
    state: WritableDraft<EditorState>,
    action: PayloadAction<string>
) => {
    const nodeId = action.payload;
    const node = state.presentation.nodes.byId[nodeId];
    const nodeParentLayer = state.presentation.layers.byId[node.layerId];

    // Убираем node
    delete state.presentation.nodes.byId[nodeId];
    state.presentation.nodes.allIds = state.presentation.nodes.allIds.filter(
        (id) => id !== nodeId
    );

    // Убираем ссылку на node из слоя
    nodeParentLayer.nodeIds = nodeParentLayer.nodeIds.filter(
        (id) => id !== nodeId
    );

    // Сбрасываем активные элементы
    if (state.activeNodeId === nodeId) {
        state.activeNodeId = null;
    }
};

export const selectNodeReducer = (
    state: WritableDraft<EditorState>,
    action: PayloadAction<string>
) => {
    const nodeId = action.payload;
    state.activeNodeId = nodeId;
};
