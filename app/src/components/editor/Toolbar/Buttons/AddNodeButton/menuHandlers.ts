import { actions as editorActions } from "@/features/editor/editorSlice";
import { AppDispatch } from "@/store";
import { ImageNodeItem } from "@/features/editor/types";

export const addTempImageNode = async (
    dispatch: AppDispatch,
    isDialogOpen: boolean
) => {
    if (isDialogOpen) return;
    dispatch(editorActions.updateProjectState({ isDialogOpen: true }));

    try {
        const { id, tempPath, relPath, name, width, height } =
            await window.fsAPI.addTempImage();

        const image: ImageNodeItem = {
            id,
            type: "image",
            layerId: "",
            name,
            tempPath,
            relPath,
            transform: {
                width,
                height,
                x: 0,
                y: 0,
                rotation: 0,
            },
        };

        dispatch(editorActions.addNode(image));
        dispatch(editorActions.updateProjectState({ isDialogOpen: false }));
    } catch (err) {
        console.debug("Отмена!", err);
        dispatch(editorActions.updateProjectState({ isDialogOpen: false }));
    }
};
