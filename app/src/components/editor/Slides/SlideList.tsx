import { useSelector, useDispatch } from "react-redux";
import { actions as editorActions } from "@/features/editor/editorSlice";
import { selectAllSlides, selectAllSlideIds, selectAllActiveIds } from "@/features/editor/selectors";

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
import SlideListItem from "./SlideListItem";

import { ItemParams } from "react-contexify";
import { useContextMenu } from "@/hooks";

import "./slide-list.css";

const SlidesList = () => {
    // Redux
    const { activeSlideId } = useSelector(selectAllActiveIds);
    const slides = useSelector(selectAllSlides);
    const slideIds = useSelector(selectAllSlideIds);
    const dispatch = useDispatch();

    // DnD Kit
    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: { distance: 5 },
        })
    );

    const getItemIndex = (id: UniqueIdentifier) => slideIds.findIndex((slideId) => slideId === id);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = getItemIndex(active.id);
        const newIndex = getItemIndex(over.id);

        arrayMove(slideIds, oldIndex, newIndex);
        dispatch(editorActions.reorderSlides({ oldIndex, newIndex }));
    };

    const handleItemClick = ({ id }: ItemParams) => {
        switch (id) {
            case "delete":
                dispatch(editorActions.removeSlide(activeSlideId as string));
                break;
        }
    };

    const menuOptions = [{ id: "delete", label: "Удалить", onClick: handleItemClick }];

    const { handleShowMenu, menu } = useContextMenu({
        menuId: "slide-context-menu",
        options: menuOptions,
    });

    return (
        <div className="slide-list-container">
            <div className="slide-list-scroll">
                <div className="slide-list">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCorners}
                        onDragEnd={handleDragEnd}
                        modifiers={[restrictToParentElement, restrictToVerticalAxis]}
                    >
                        <SortableContext items={slideIds} strategy={verticalListSortingStrategy}>
                            {slideIds.map((id, index) => {
                                const slide = slides.find((s) => s.id === id);
                                if (!slide) return null;
                                return (
                                    <SlideListItem
                                        key={id}
                                        slide={slide}
                                        index={index}
                                        handleShowMenu={handleShowMenu}
                                    />
                                );
                            })}
                        </SortableContext>
                    </DndContext>
                    {menu}
                </div>
                <button className="add-slide-button" onClick={() => dispatch(editorActions.addSlide())}>
                    +
                </button>
            </div>
        </div>
    );
};

export default SlidesList;
