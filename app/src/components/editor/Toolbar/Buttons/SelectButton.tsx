import { useDispatch } from "react-redux";
import { actions as editorActions } from "@/features/editor/editorSlice";

import Button from "./Button";
import { BsCursorFill } from "react-icons/bs";

const SelectButton = () => {
    const dispatch = useDispatch();

    const handleClick = () => {};

    return (
        <Button
            title="Выбрать"
            icon={<BsCursorFill size={28} />}
            onClick={handleClick}
        />
    );
};

export default SelectButton;
