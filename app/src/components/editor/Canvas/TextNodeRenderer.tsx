import { ComponentRef, useEffect, useRef } from "react";

import { useSelector, useDispatch } from "react-redux";
import { actions as editorActions } from "@/features/editor/editorSlice";
import { selectAllActiveIds } from "@/features/editor/selectors";
import { TextNodeItem } from "@/features/editor/types";

import { Group as KonvaGroup, Text as KonvaText, Rect as KonvaRect, Transformer } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";

interface TextNodeRendererProps {
    node: TextNodeItem;
    handleShowMenu: (event: any) => void;
}

const TextNodeRenderer = ({ node, handleShowMenu }: TextNodeRendererProps) => {
    const { activeNodeId, activeLayerId } = useSelector(selectAllActiveIds);
    const dispatch = useDispatch();

    const konvaGroupRef = useRef<ComponentRef<typeof KonvaGroup>>(null);
    const konvaRectRef = useRef<ComponentRef<typeof KonvaRect>>(null);
    const transformerRef = useRef<ComponentRef<typeof Transformer>>(null);

    // Привязка трансформера
    useEffect(() => {
        const transformer = transformerRef.current;
        const targetNode = konvaRectRef.current;
        if (!transformer || !targetNode) return;

        if (activeNodeId === node.id) transformer.nodes([targetNode]);
        else transformer.nodes([]);
        transformer.getLayer()?.batchDraw();
    }, [activeNodeId, node]);

    // События
    const handleOnClick = (e: KonvaEventObject<Event>) => {
        if (node.layerId !== activeLayerId) return;
        dispatch(editorActions.selectNode(node.id));
    };

    const handleTransformEnd = (e: KonvaEventObject<Event>) => {
        const konvaGroupNode = konvaGroupRef.current;
        const konvaRectNode = konvaRectRef.current;

        if (!konvaGroupNode || !konvaRectNode) return;

        const scaleX = konvaRectNode.scaleX();
        const scaleY = konvaRectNode.scaleY();

        konvaRectNode.scaleX(1);
        konvaRectNode.scaleY(1);
        konvaRectNode.width(Math.max(5, konvaRectNode.width() * scaleX));
        konvaRectNode.height(Math.max(5, konvaRectNode.height() * scaleY));

        const updatedNode: TextNodeItem = {
            ...node, // копируем все свойства старого узла
            transform: {
                // создаём новый объект transform
                ...node.transform,
                width: konvaRectNode.width(),
                height: konvaRectNode.height(),
                x: konvaRectNode.x(),
                y: konvaRectNode.y(),
                rotation: konvaRectNode.rotation(),
            },
        };

        dispatch(editorActions.updateNode(updatedNode));
    };

    const handleDragEnd = (e: KonvaEventObject<Event>) => {
        const konvaRectNode = konvaRectRef.current;

        if (!konvaRectNode) return;

        const updatedNode: TextNodeItem = {
            ...node, // копируем все свойства старого узла
            transform: {
                ...node.transform,
                x: konvaRectNode.x(),
                y: konvaRectNode.y(),
            },
        };

        dispatch(editorActions.updateNode(updatedNode));
    };

    const handleDblClick = (e: KonvaEventObject<Event>) => {
        // Заготовка для редактирования текста с помощью двойного клика
    };

    return (
        <>
            <KonvaGroup ref={konvaGroupRef}>
                <KonvaRect
                    x={node.transform.x}
                    y={node.transform.y}
                    rotation={node.transform.rotation}
                    width={node.transform.width}
                    height={node.transform.height}
                    fill="black"
                    cornerRadius={12}
                />

                <KonvaText
                    x={node.transform.x}
                    y={node.transform.y}
                    rotation={node.transform.rotation}
                    width={node.transform.width}
                    height={node.transform.height}
                    fill="white"
                    text={node.text}
                    fontSize={node.fontSize}
                    padding={node.padding}
                    align="center"
                    verticalAlign="middle"
                    onDblClick={handleDblClick}
                />
            </KonvaGroup>
            <KonvaRect
                ref={konvaRectRef}
                x={node.transform.x}
                y={node.transform.y}
                rotation={node.transform.rotation}
                width={node.transform.width}
                height={node.transform.height}
                onContextMenu={handleShowMenu}
                draggable={activeNodeId === node.id && !node.transform.isLocked}
                onDragEnd={handleDragEnd}
                onClick={handleOnClick}
                onTransformEnd={handleTransformEnd}
                // fill="yellow"
            />
            {!node.transform.isLocked && (
                <Transformer ref={transformerRef} rotateEnabled={true} anchorSize={10} borderDash={[6, 2]} />
            )}
        </>
    );
};

export default TextNodeRenderer;
