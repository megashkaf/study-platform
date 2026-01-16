import { useDispatch } from "react-redux";
import { actions as editorActions } from "@/features/editor/editorSlice";

import Button from "./Button";
import { BsZoomIn, BsZoomOut } from "react-icons/bs";

const ZoomButtons = () => {
    const dispatch = useDispatch();

    return (
        <>
            <Button
                title="Приблизить"
                onClick={() => dispatch(editorActions.zoomIn(0.1))}
                icon={<BsZoomIn size={28} />}
            />
            <Button
                title="Отдалить"
                onClick={() => dispatch(editorActions.zoomOut(0.1))}
                icon={<BsZoomOut size={28} />}
            />
        </>
    );
};

export default ZoomButtons;
