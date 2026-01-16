import { useSelector, useDispatch } from "react-redux";
import { actions as editorActions } from "@/features/editor/editorSlice";
import { selectActiveSlideLayers, selectActiveSlideLayerIds, selectAllActiveIds } from "@/features/editor/selectors";

import {
    closestCorners,
    DndContext,
    DragEndEvent,
    UniqueIdentifier,
    MouseSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToParentElement, restrictToVerticalAxis } from "@dnd-kit/modifiers";

import LayersListToolbar from "./LayerListToolbar";
import LayerListItem from "./LayerListItem";

import { ItemParams } from "react-contexify";
import { useContextMenu } from "@/hooks";

import "./layer-list.css";

const LayersList = () => {
    // Redux
    const { activeLayerId } = useSelector(selectAllActiveIds);
    const layers = useSelector(selectActiveSlideLayers);
    const layerIds = useSelector(selectActiveSlideLayerIds);
    const dispatch = useDispatch();

    // DnD Kit
    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: { distance: 5 },
        })
    );

    const getItemIndex = (id: UniqueIdentifier) => layerIds.findIndex((slideId) => slideId === id);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = getItemIndex(active.id);
        const newIndex = getItemIndex(over.id);

        arrayMove(layerIds, oldIndex, newIndex);
        dispatch(editorActions.reorderLayers({ oldIndex, newIndex }));
    };

    const handleItemClick = ({ id }: ItemParams) => {
        switch (id) {
            case "delete":
                hideAll();
                dispatch(editorActions.removeLayer(activeLayerId as string));
                break;
        }
    };

    const menuOptions = [{ id: "delete", label: "Удалить", onClick: handleItemClick }];

    const { handleShowMenu, menu, hideAll } = useContextMenu({
        menuId: "layer-context-menu",
        options: menuOptions,
    });

    return (
        <div className="layer-list-container">
            <LayersListToolbar />
            <div className="layer-list-scroll">
                <div className="layer-list">
                    <div className="layer-list-group divide-group-y">
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCorners}
                            onDragEnd={handleDragEnd}
                            modifiers={[restrictToParentElement, restrictToVerticalAxis]}
                        >
                            <SortableContext items={layerIds} strategy={verticalListSortingStrategy}>
                                {layerIds.map((id, index) => {
                                    const layer = layers.find((s) => s.id === id);
                                    if (!layer) return null;
                                    return (
                                        <LayerListItem
                                            key={id}
                                            layer={layer}
                                            index={index}
                                            handleShowMenu={handleShowMenu}
                                        />
                                    );
                                })}
                            </SortableContext>
                        </DndContext>
                        {menu}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LayersList;
