import { useSelector, useDispatch } from "react-redux";
import { selectActiveLayerType, selectProjectState } from "@/features/editor/selectors";

import { AppDispatch } from "@/store";
import { actions as editorActions } from "@/features/editor/editorSlice";
import { ImageNodeItem } from "@/features/editor/types";

import "./inputs.css";

const FileInput = () => {
    const { isDialogOpen } = useSelector(selectProjectState);
    const dispatch = useDispatch<AppDispatch>();

    const handleClick = async () => {
        await addTempImageNode(dispatch, isDialogOpen);
    };

    interface ToolbarButtonProps {
        title: string;
        onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    }

    const Button = ({ title, onClick }: ToolbarButtonProps) => {
        return (
            <button title={title} onClick={onClick}>
                {title}
            </button>
        );
    };

    const addTempImageNode = async (dispatch: AppDispatch, isDialogOpen: boolean) => {
        if (isDialogOpen) return;
        dispatch(editorActions.updateProjectState({ isDialogOpen: true }));

        try {
            const { id, tempPath, relPath, name, width, height } = await window.fsAPI.addTempImage();

            const image: ImageNodeItem = {
                id,
                type: "image",
                layerId: "",
                name,
                tempPath,
                relPath,
                transform: {
                    width: 1920,
                    height: 1080,
                    x: 0,
                    y: 0,
                    rotation: 0,
                    isLocked: true,
                },
            };

            dispatch(editorActions.addNode(image));
            dispatch(editorActions.updateProjectState({ isDialogOpen: false }));
        } catch (err) {
            console.debug("Отмена!", err);
            dispatch(editorActions.updateProjectState({ isDialogOpen: false }));
        }
    };

    return (
        <div className="custom-input" id="file">
            <Button title="Выбрать" onClick={handleClick} />
            <span>Не выбрано</span>
        </div>
    );
};

export default FileInput;
