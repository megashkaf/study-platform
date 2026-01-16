import { useSelector, useDispatch } from "react-redux";
import { actions as editorActions } from "@/features/editor/editorSlice";
import { LayerItem } from "@/features/editor/types";
import { selectAllActiveIds } from "@/features/editor/selectors";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import LayerTypeIcon from "./LayerTypeIcon";

interface LayerListItemProps {
    layer: LayerItem;
    index: number;
    handleShowMenu: (event: any) => void;
}

const LayerListItem = ({
    layer,
    index,
    handleShowMenu,
}: LayerListItemProps) => {
    const { activeLayerId } = useSelector(selectAllActiveIds);
    const dispatch = useDispatch();

    // Dnd-kit
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: layer.id });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    // Events
    const handleClick = (e: React.MouseEvent) => {
        dispatch(editorActions.selectLayer(layer.id));
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        dispatch(editorActions.selectLayer(layer.id));
        handleShowMenu(e);
    };

    return (
        <button
            ref={setNodeRef}
            onClick={handleClick}
            onContextMenu={handleContextMenu}
            {...attributes}
            {...listeners}
            className={`layer-list-item ${
                activeLayerId == layer.id ? "active" : ""
            }`}
            style={style}
            title={layer.id}
        >
            <LayerTypeIcon type={layer.type} />
            <span>{layer.name}</span>
            <div className="marker"></div>
        </button>
    );
};

export default LayerListItem;
