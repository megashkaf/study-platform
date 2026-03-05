import { ComponentRef, useEffect, useRef, useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import { actions as editorActions } from "@/features/editor/editorSlice";
import { MaskInputNodeItem } from "@/features/editor/types";
import { selectPlayerState } from "@/features/editor/selectors";

import { Image as KonvaImage } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";

interface MaskInputNodeRendererProps {
    node: MaskInputNodeItem;
    handleShowMenu: (event: any) => void;
}

const MaskInputNodeRenderer = ({ node, handleShowMenu }: MaskInputNodeRendererProps) => {
    const { playerState } = useSelector(selectPlayerState);
    const dispatch = useDispatch();

    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const konvaImageRef = useRef<ComponentRef<typeof KonvaImage>>(null);

    // Загрузка изображения
    useEffect(() => {
        let cancelled = false; // флаг отмены на случай быстрого обновления

        const loadImage = async () => {
            const dataUrl = await window.fsAPI.loadImageBase64(node.tempPath);
            const img = new window.Image();
            img.src = dataUrl;
            img.onload = () => {
                if (!cancelled) setImage(img);
            };
        };

        loadImage();

        return () => {
            cancelled = true; // очистка при unmount или смене node.tempPath
        };
    }, [node.tempPath]);

    // События
    const handleOnClick = (e: KonvaEventObject<Event>) => {
        if (playerState.isVisible) return;
        dispatch(editorActions.selectNode(node.id));
    };

    if (!image) return null;

    return (
        <>
            <KonvaImage
                key={node.id}
                ref={konvaImageRef}
                image={image ?? undefined}
                x={0}
                y={0}
                width={1920}
                height={1080}
                rotation={0}
                draggable={false}
                onClick={handleOnClick}
                onContextMenu={handleShowMenu}
            />
        </>
    );
};

export default MaskInputNodeRenderer;
