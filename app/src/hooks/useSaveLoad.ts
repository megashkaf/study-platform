import { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { actions as editorActions } from "@/features/editor/editorSlice";
import { selectPresentation, selectProjectState } from "@/features/editor/selectors";

export default function useSaveLoad() {
    const presentation = useSelector(selectPresentation);
    const { filePath, isDirty, isDialogOpen } = useSelector(selectProjectState);
    const dispatch = useDispatch();

    // --------- Utils ---------
    const updateProjectState = useCallback(
        (updates: { filePath?: string; isDirty?: boolean; isDialogOpen?: boolean }) => {
            // console.log(updates);
            dispatch(editorActions.updateProjectState(updates));
        },
        [dispatch]
    );

    // --------- Handlers ---------
    const handleNew = useCallback(async () => {
        if (isDialogOpen) return;

        dispatch(editorActions.removePresentation());
        console.log("Новый проект");
    }, [isDialogOpen, dispatch]);

    const handleSave = useCallback(async () => {
        if (!isDirty || isDialogOpen) return;

        try {
            await window.projectAPI.save(presentation, null, filePath!);
            updateProjectState({ isDirty: false });
            console.log("Проект сохранен: ", filePath);
        } catch (err) {
            console.error(err);
        }
    }, [isDirty, isDialogOpen, presentation, filePath, updateProjectState]);

    const handleSaveAs = useCallback(async () => {
        if (!isDirty || isDialogOpen) return;
        updateProjectState({ isDialogOpen: true });

        // Сохраняем старый title на случай ошибки
        const oldTitle = presentation.title;

        try {
            const result = await window.electronAPI.showSaveAsDialog();
            if (!result) return updateProjectState({ isDialogOpen: false });

            const { filePath: newFilePath, fileName: newFileName } = result;
            if (!newFilePath || !newFileName) return updateProjectState({ isDialogOpen: false });

            dispatch(editorActions.setTitle(newFileName));
            await window.projectAPI.save(presentation, newFileName, newFilePath);

            updateProjectState({
                filePath: newFilePath,
                isDirty: false,
                isDialogOpen: false,
            });
            console.log("Проект сохранен как: ", newFilePath);
        } catch (err) {
            console.error(err);
            dispatch(editorActions.setTitle(oldTitle));
            updateProjectState({ isDialogOpen: false });
        }
    }, [isDirty, isDialogOpen, presentation, filePath, dispatch, updateProjectState]);

    const handleOpen = useCallback(async () => {
        if (isDialogOpen) return;
        updateProjectState({ isDialogOpen: true });

        try {
            const presentation = await window.projectAPI.open();
            if (!presentation) return;

            dispatch(editorActions.updatePresentation(presentation));
            console.log("Проект загружен:", presentation);
        } catch (err) {
            console.error(err);
            updateProjectState({ isDialogOpen: false });
        }
    }, [isDialogOpen, dispatch, updateProjectState]);

    // --------- Events ---------
    useEffect(() => {
        const unsubscribe = window.menuAPI.onNewProject(handleNew);
        return () => unsubscribe();
    }, [handleNew]);

    useEffect(() => {
        const unsubscribe = window.menuAPI.onSaveProject(filePath == null ? handleSaveAs : handleSave);
        return () => unsubscribe();
    }, [filePath, handleSave, handleSaveAs]);

    useEffect(() => {
        const unsubscribe = window.menuAPI.onSaveProjectAs(handleSaveAs);
        return () => unsubscribe();
    }, [handleSaveAs]);

    useEffect(() => {
        const unsubscribe = window.menuAPI.onOpenProject(handleOpen);
        return () => unsubscribe();
    }, [handleOpen]);
}
