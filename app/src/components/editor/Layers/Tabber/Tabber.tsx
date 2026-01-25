import { useSelector, useDispatch } from "react-redux";
import { actions as editorActions } from "@/features/editor/editorSlice";
import {
    selectActiveSlideLayers,
    selectActiveSlideLayerIds,
    selectAllActiveIds,
} from "@/features/editor/selectors";

import { LayerItem } from "@/features/editor/types";

import LayerTypeIcon from "../LayerTypeIcon";

import BackgroundTab from "./BackgroundTab";
// import BackgroundTab from "./BackgroundTab";
// import BackgroundTab from "./BackgroundTab";
// import BackgroundTab from "./BackgroundTab";

import "./tabber.css";

const Tabber = () => {
    // Redux
    const { activeLayerId } = useSelector(selectAllActiveIds);
    const layers = useSelector(selectActiveSlideLayers);
    const activeLayer = layers.find((s) => s.id === activeLayerId);
    const layerIds = useSelector(selectActiveSlideLayerIds);
    const dispatch = useDispatch();

    interface TabberButtonProps {
        layer: LayerItem;
    }
    const TabberButton = ({ layer }: TabberButtonProps) => {
        return (
            <button
                id={layer.id === activeLayerId ? "active" : ""}
                onClick={() => dispatch(editorActions.selectLayer(layer.id))}
                title={layer.name}
            >
                <LayerTypeIcon type={layer.type} />
            </button>
        );
    };

    const layerTabs = {
        background: <BackgroundTab />,
        info: <></>,
        hints: <></>,
        input: <></>,
    };

    return (
        <div className="layers-tabber divide-group-y">
            <div className="tabs">
                {layerIds.map((id, index) => {
                    const layer = layers.find((s) => s.id === id);
                    if (!layer) return null;
                    return <TabberButton key={id} layer={layer} />;
                })}
            </div>

            <div className="content">
                {activeLayer && layerTabs[activeLayer.type]}
            </div>
        </div>
    );
};

export default Tabber;
