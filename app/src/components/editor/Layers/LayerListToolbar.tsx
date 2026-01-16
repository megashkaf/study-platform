import { actions as editorActions } from "@/features/editor/editorSlice";
import { AddLayerPayload } from "@/features/editor/reducers/layer";
import { useDispatch } from "react-redux";
import LayerTypeIcon from "./LayerTypeIcon";

const LayersListToolbar = () => {
    const datas: AddLayerPayload[] = [
        { type: "background", name: "Фон" },
        { type: "info", name: "Информация" },
        { type: "hints", name: "Подсказки" },
        { type: "input", name: "Ввод" },
    ];
    const dispatch = useDispatch();

    return (
        <div className="layer-list-toolbar">
            {datas.map((data, index) => (
                <button
                    key={index}
                    title={data.name}
                    className="layer-list-toolbar-item"
                    onClick={() =>
                        dispatch(
                            editorActions.addLayer({
                                type: data.type,
                                name: data.name,
                            })
                        )
                    }
                >
                    <LayerTypeIcon type={data.type} />
                </button>
            ))}
        </div>
    );
};

export default LayersListToolbar;
