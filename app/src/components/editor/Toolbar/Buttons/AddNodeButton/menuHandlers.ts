import { actions as editorActions } from "@/features/editor/editorSlice";
import { AppDispatch } from "@/store";
import { ImageNodeItem, TextNodeItem } from "@/features/editor/types";
import { nanoid } from "@reduxjs/toolkit";

export const addImageNode = async (dispatch: AppDispatch, isDialogOpen: boolean) => {
    if (isDialogOpen) return;
    dispatch(editorActions.updateProjectState({ isDialogOpen: true }));

    try {
        const { id, tempPath, relPath, name, width, height } = await window.fsAPI.addTempImage();

        const image: ImageNodeItem = {
            id,
            type: "image",
            layerId: "", // id присваивается в addNode()
            name,
            tempPath,
            relPath,
            transform: {
                width,
                height,
                x: 0,
                y: 0,
                rotation: 0,
                isLocked: false,
            },
        };

        dispatch(editorActions.addNode(image));
        dispatch(editorActions.updateProjectState({ isDialogOpen: false }));
    } catch (err) {
        console.debug("Отмена!", err);
        dispatch(editorActions.updateProjectState({ isDialogOpen: false }));
    }
};

export const addTextNode = async (dispatch: AppDispatch, isDialogOpen: boolean) => {
    if (isDialogOpen) return;

    const text: TextNodeItem = {
        id: nanoid(),
        type: "text",
        text: "Новый текст",
        fontSize: 48,
        padding: 6,
        layerId: "", // id присваивается в addNode()
        name: "Новый текст",
        transform: {
            width: 500,
            height: 100,
            x: 0,
            y: 0,
            rotation: 0,
            isLocked: false,
        },
    };

    dispatch(editorActions.addNode(text));
};
