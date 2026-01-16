import { useSelector, useDispatch } from "react-redux";
import { actions as editorActions } from "@/features/editor/editorSlice";
import { SlideItem } from "@/features/editor/types";
import { selectAllActiveIds } from "@/features/editor/selectors";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SlideListItemProps {
    slide: SlideItem;
    index: number;
    handleShowMenu: (event: any) => void;
}

const SlideListItem = ({
    slide,
    index,
    handleShowMenu,
}: SlideListItemProps) => {
    const { activeSlideId } = useSelector(selectAllActiveIds);
    const dispatch = useDispatch();

    // Dnd-kit
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: slide.id });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    // Events
    const handleClick = (e: React.MouseEvent) => {
        dispatch(editorActions.selectSlide(slide.id));
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        dispatch(editorActions.selectSlide(slide.id));
        handleShowMenu(e);
    };

    return (
        <button
            ref={setNodeRef}
            onClick={handleClick}
            onContextMenu={handleContextMenu}
            {...attributes}
            {...listeners}
            className={`slide-list-item ${
                activeSlideId == slide.id ? "active" : ""
            }`}
            style={style}
            title={slide.id}
        >
            {index + 1}
        </button>
    );
};

export default SlideListItem;
