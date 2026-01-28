import { useSelector, useDispatch } from "react-redux";
import {
    selectActiveLayerType,
    selectProjectState,
} from "@/features/editor/selectors";

import { AppDispatch } from "@/store";
import { actions as editorActions } from "@/features/editor/editorSlice";
import { ImageNodeItem } from "@/features/editor/types";

import "./inputs.css";

const WindowScreenshotInput = () => {
    const handleClick = async () => {
        await window.screenshotAPI.captureWindow();
    };

    return (
        <div className="custom-input" id="file">
            <button onClick={handleClick}>Выбрать</button>
            <span>Не выбрано</span>
        </div>
    );
};

export default WindowScreenshotInput;
