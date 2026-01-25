import { useSelector, useDispatch } from "react-redux";
import { actions as editorActions } from "@/features/editor/editorSlice";
import {
    selectCanvasScale,
    selectActiveSlideLayers,
    selectActiveSlideNodes,
    selectAllActiveIds,
} from "@/features/editor/selectors";

import { Layer, Stage } from "react-konva";
import { NodeRenderer } from "./NodeRenderer";

import { ItemParams } from "react-contexify";
import { useContextMenu } from "@/hooks";

import "./canvas.css";

const Canvas = () => {
    const stageWidth = 1920;
    const stageHeight = 1080;

    // Redux
    const { activeNodeId } = useSelector(selectAllActiveIds);
    const scale = useSelector(selectCanvasScale);
    const layers = useSelector(selectActiveSlideLayers);
    const nodes = useSelector(selectActiveSlideNodes);
    const dispatch = useDispatch();

    const handleItemClick = ({ id }: ItemParams) => {
        switch (id) {
            case "delete":
                hideAll();
                dispatch(editorActions.removeNode(activeNodeId as string));
                break;
        }
    };

    const menuOptions = [
        { id: "delete", label: "Удалить", onClick: handleItemClick },
    ];

    const { handleShowMenu, menu, hideAll } = useContextMenu({
        menuId: "node-context-menu",
        options: menuOptions,
    });

    return (
        <div className="canvas-container">
            <div className="stage-wrapper">
                <Stage
                    width={stageWidth * scale}
                    height={stageHeight * scale}
                    scaleX={scale}
                    scaleY={scale}
                    className="stage"
                >
                    {layers.toReversed().map((layer) => (
                        <Layer key={layer.id}>
                            {nodes
                                .filter((node) => node.layerId === layer.id)
                                .map((node) => (
                                    <NodeRenderer
                                        key={node.id}
                                        node={node}
                                        handleShowMenu={handleShowMenu}
                                    />
                                ))}
                        </Layer>
                    ))}
                </Stage>
                {menu}
            </div>
        </div>
    );
};

export default Canvas;
