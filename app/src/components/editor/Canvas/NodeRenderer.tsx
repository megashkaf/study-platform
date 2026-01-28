import { useEffect, useRef, useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import { actions as editorActions } from "@/features/editor/editorSlice";
import { selectAllActiveIds } from "@/features/editor/selectors";
import { AnyNodeItem, ImageNodeItem } from "@/features/editor/types";

import { Image as KonvaImage, Transformer } from "react-konva";
import type { Image as KonvaImageType } from "konva/lib/shapes/Image";
import type { Transformer as TransformerType } from "konva/lib/shapes/Transformer";
import { KonvaEventObject } from "konva/lib/Node";

interface NodeRendererProps {
    node: AnyNodeItem;
    handleShowMenu: (event: any) => void;
}

export const NodeRenderer = ({ node, handleShowMenu }: NodeRendererProps) => {
    const { activeNodeId } = useSelector(selectAllActiveIds);
    const dispatch = useDispatch();

    switch (node.type) {
        case "image": {
            const [image, setImage] = useState<HTMLImageElement | null>(null);
            const konvaImageRef = useRef<KonvaImageType>(null);
            const transformerRef = useRef<TransformerType>(null);

            // Загрузка изображения
            useEffect(() => {
                let cancelled = false; // флаг отмены на случай быстрого обновления

                const loadImage = async () => {
                    const dataUrl = await window.fsAPI.loadImageBase64(
                        node.tempPath,
                    );
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

            // Привязка трансформера
            useEffect(() => {
                const transformer = transformerRef.current;
                const konvaImage = konvaImageRef.current;
                if (!transformer || !konvaImage) return;

                if (activeNodeId === node.id) transformer.nodes([konvaImage]);
                else transformer.nodes([]);
                transformer.getLayer()?.batchDraw();
            }, [activeNodeId, node.id, image]);

            // События
            const handleTransformEnd = (e: KonvaEventObject<Event>) => {
                const konvaNode = konvaImageRef.current;
                if (!konvaNode) return;

                const scaleX = konvaNode.scaleX();
                const scaleY = konvaNode.scaleY();

                konvaNode.scaleX(1);
                konvaNode.scaleY(1);
                konvaNode.width(Math.max(5, konvaNode.width() * scaleX));
                konvaNode.height(Math.max(5, konvaNode.height() * scaleY));

                updateTransform(e.target as KonvaImageType);
            };

            function updateTransform(shape: KonvaImageType) {
                const updatedNode: ImageNodeItem = {
                    ...node, // копируем все свойства старого узла
                    transform: {
                        // создаём новый объект transform
                        width: shape.width(),
                        height: shape.height(),
                        x: shape.x(),
                        y: shape.y(),
                        rotation: shape.rotation(),
                        locked: false,
                    },
                };

                dispatch(editorActions.updateNode(updatedNode));
            }

            const handleDragEnd = (e: KonvaEventObject<Event>) =>
                updateTransform(e.target as KonvaImageType);

            const handleOnClick = (e: KonvaEventObject<Event>) =>
                dispatch(editorActions.selectNode(node.id));

            if (!image) return null;

            return (
                <>
                    <KonvaImage
                        key={node.id}
                        ref={konvaImageRef}
                        image={image ?? undefined}
                        x={node.transform.x}
                        y={node.transform.y}
                        width={node.transform.width}
                        height={node.transform.height}
                        rotation={node.transform.rotation}
                        draggable={
                            activeNodeId === node.id && !node.transform.locked
                        }
                        onTransformEnd={handleTransformEnd}
                        onDragEnd={handleDragEnd}
                        onClick={handleOnClick}
                        onContextMenu={handleShowMenu}
                    />
                    {!node.transform.locked && (
                        <Transformer
                            ref={transformerRef}
                            rotateEnabled={true}
                            enabledAnchors={[
                                "top-left",
                                "top-right",
                                "bottom-left",
                                "bottom-right",
                            ]}
                            anchorSize={10}
                            borderDash={[6, 2]}
                        />
                    )}
                </>
            );
        }

        // case "rect":
        //   return (
        //     <Rect
        //       key={node.id}
        //       x={node.x}
        //       y={node.y}
        //       width={node.width}
        //       height={node.height}
        //       fill={node.fill}
        //     />
        //   );

        default:
            return null;
    }
};
