import { useSelector, useDispatch } from "react-redux";
import { actions as editorActions } from "@/features/editor/editorSlice";
import { selectActiveSlideLayers, selectActiveSlideNodes, selectPlayerState } from "@/features/editor/selectors";

import { Layer, Stage } from "react-konva";
import AnyNodeRenderer from "../Canvas/AnyNodeRenderer";

import "./player.css";

const Player = () => {
    const stageWidth = 1920;
    const stageHeight = 1080;
    const scale = 0.8;

    // Redux
    const { playerState } = useSelector(selectPlayerState);
    const layers = useSelector(selectActiveSlideLayers);
    const nodes = useSelector(selectActiveSlideNodes);
    const dispatch = useDispatch();

    const handleStageClick = (e: any) => {
        // if (e.target === e.target.getStage()) {
        // }
        if (e.target.attrs.name != "rect-input") {
            console.log("Ошибка!");
            dispatch(editorActions.addMistake());
        }
    };

    return (
        <div className="player-overlay">
            <div className="stage-wrapper">
                <Stage
                    width={stageWidth * scale}
                    height={stageHeight * scale}
                    scaleX={scale}
                    scaleY={scale}
                    className="stage"
                    onClick={handleStageClick}
                >
                    {layers.map((layer) => (
                        <Layer key={layer.id}>
                            {nodes
                                .filter((node) => node.layerId === layer.id)
                                .map((node) => (
                                    <AnyNodeRenderer key={node.id} node={node} />
                                ))}
                        </Layer>
                    ))}
                </Stage>
            </div>
        </div>
    );
};

export default Player;
