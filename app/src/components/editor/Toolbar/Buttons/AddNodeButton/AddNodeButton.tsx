import { useSelector, useDispatch } from "react-redux";
import { selectActiveLayerType, selectProjectState } from "@/features/editor/selectors";

import { BsFillPlusCircleFill } from "react-icons/bs";
import Button from "../Button";

import { useContextMenu } from "@/hooks";
import { ItemParams } from "react-contexify";
import { AppDispatch } from "@/store";
import { addImageNode, addTextNode } from "./menuHandlers";

const AddNodeButton = () => {
    const { isDialogOpen } = useSelector(selectProjectState);
    const layerType = useSelector(selectActiveLayerType);
    const dispatch = useDispatch<AppDispatch>();

    const handleItemClick = async ({ id }: ItemParams) => {
        switch (id) {
            case "image":
                hideAll();
                await addImageNode(dispatch, isDialogOpen);
                break;
            case "text":
                hideAll();
                addTextNode(dispatch, isDialogOpen);
        }
    };

    const menuOptions = [
        { id: "image", label: "Изображение", onClick: handleItemClick },
        { id: "text", label: "Текст", onClick: handleItemClick },
    ];

    const { handleShowMenu, menu, hideAll } = useContextMenu({
        menuId: "add-node-button-context-menu",
        options: menuOptions,
    });

    if (layerType === "background" || layerType === "input") return null;

    return (
        <>
            <Button title="Добавить" icon={<BsFillPlusCircleFill size={28} />} onClick={handleShowMenu} />
            {menu}
        </>
    );
};

export default AddNodeButton;
