import React, { useEffect, useRef, useState } from "react";

import { Stage } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import { TextConfig } from "konva/lib/shapes/Text";

import { RootState } from "@/store";
import { useSelector, useDispatch } from "react-redux";

// import "./appCanvas.css";

import AppLayer from "./AppLayer";
import { ListLayer } from "../layers/types";
import { addKonvaNode } from "../layers/slideListSlice";
import { nanoid } from "@reduxjs/toolkit";
import { RectConfig } from "konva/lib/shapes/Rect";

const AppCanvas = () => {
    // Stage
    const [scale, setScale] = useState(0.6); // масштабирование
    const stageWidth = 1920;
    const stageHeight = 1080;

    // Layers
    const items = useSelector((state: RootState) => state.slideList.items);
    const selectedId = useSelector(
        (state: RootState) => state.slideList.selectedId
    );
    const dispatch = useDispatch();

    const handleClick = (e: KonvaEventObject<MouseEvent>) => {
        if (selectedId == null) return;

        console.log(1);
        const stage = e.target.getStage();
        if (!stage) return;

        const pointerPos = stage.getPointerPosition();
        if (!pointerPos) return;

        // Получаем масштаб
        const scaleX = stage.scaleX();
        const scaleY = stage.scaleY();

        // Преобразуем координаты
        const x = (pointerPos.x - stage.x()) / scaleX;
        const y = (pointerPos.y - stage.y()) / scaleY;

        const textConfig: TextConfig = {
            id: nanoid(),
            type: "text",
            x,
            y,
            text: "Новый текст!",
            fontSize: 20,
            fill: "black",
        };

        const padding = 10;

        const rectConfig: RectConfig = {
            id: nanoid(),
            type: "rect",
            x: x - padding,
            y: y - padding,
            width: (textConfig.text?.length ?? 0) * 12 + padding * 2, // грубая оценка ширины текста
            height: textConfig.fontSize! + padding * 2,
            fill: "white",
        };

        dispatch(addKonvaNode({ id: selectedId, value: rectConfig }));
        dispatch(addKonvaNode({ id: selectedId, value: textConfig }));
    };

    const [img, setImg] = useState<string>();

    const takeScreenshot = async () => {
        const screenshot = await window.screenshotAPI.getScreenshot();
        setImg(screenshot);
    };

    const [windows, setWindows] = useState<{ id: string; name: string }[]>([]);
    const [selectedWindow, setSelectedWindow] = useState<string | null>(null);
    const [screenshot, setScreenshot] = useState<string | null>(null);

    useEffect(() => {
        // Загружаем список окон при монтировании
        window.electronAPI.getWindows().then(setWindows);
    }, []);

    const takeWindowScreenshot = async () => {
        if (!selectedWindow) return;

        const sources = await window.electronAPI.getWindows();
        const win = sources.find((w) => w.id === selectedWindow);
        if (!win) return;

        // Получаем MediaStream окна через getUserMedia
        const stream = await (navigator.mediaDevices as any).getUserMedia({
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: "desktop",
                    chromeMediaSourceId: win.id,
                },
            },
        });

        const video = document.createElement("video");
        video.srcObject = stream;
        await video.play();

        const canvas = document.createElement("canvas");
        canvas.width = 1920;
        canvas.height = 1080;
        const ctx = canvas.getContext("2d");

        // Ждём кадра
        await new Promise((r) => setTimeout(r, 500));
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imgBase64 = canvas.toDataURL("image/png");
        setScreenshot(imgBase64);

        // Останавливаем поток
        stream.getTracks().forEach((t: MediaStreamTrack) => t.stop());
    };

    return (
        <div className="flex justify-center items-center w-full overflow-auto">
            <Stage
                width={stageWidth * scale}
                height={stageHeight * scale}
                scaleX={scale}
                scaleY={scale}
                onClick={handleClick}
                className="stage"
            >
                {items
                    .filter((item): item is ListLayer => item.type === "layer")
                    .map((item) => (
                        <AppLayer key={item.id} item={item} />
                    ))}
            </Stage>

            <div className="absolute top-0 p-5">
                <select
                    onChange={(e) => setSelectedWindow(e.target.value)}
                    value={selectedWindow ?? ""}
                >
                    <option value="">Выберите окно</option>
                    {windows.map((w) => (
                        <option key={w.id} value={w.id}>
                            {w.name}
                        </option>
                    ))}
                </select>

                <button onClick={takeWindowScreenshot}>Сделать скриншот</button>
            </div>
            {screenshot && (
                <img className="screenshot" src={screenshot} alt="Screenshot" />
            )}
        </div>
    );
};

export default AppCanvas;
