import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { AppDispatch } from "@/store";
import { actions as editorActions } from "@/features/editor/editorSlice";
import { ImageNodeItem } from "@/features/editor/types";

import "./inputs.css";

const WindowScreenshotInput = () => {
    const [windows, setWindows] = useState<{ id: string; name: string }[]>([]);
    const [selectedWindow, setSelectedWindow] = useState<string | null>(null);

    const dispatch = useDispatch<AppDispatch>();

    const handleClick = async () => {
        try {
            const { id, tempPath, relPath, name, width, height } =
                await window.screenshotAPI.captureWindow(selectedWindow);

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
                    locked: true,
                },
            };

            dispatch(editorActions.addNode(image));
        } catch (err) {
            console.debug("Отмена!", err);
        }
    };

    useEffect(() => {
        // Загружаем список окон при монтировании
        window.electronAPI.getWindows().then(setWindows);
    }, []);

    return (
        <div className="custom-input" id="file">
            <button onClick={handleClick}>Выбрать</button>
            <select
                className="select-ellipsis"
                onChange={(e) => setSelectedWindow(e.target.value)}
                value={selectedWindow ?? ""}
            >
                <option value="">Не выбрано</option>
                {windows.map((w) => (
                    <option key={w.id} value={w.id}>
                        {w.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default WindowScreenshotInput;
