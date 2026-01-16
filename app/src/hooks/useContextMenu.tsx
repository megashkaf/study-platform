import { KonvaEventObject } from "konva/lib/Node";
import {
    Menu,
    Item,
    useContextMenu as useContexifyContextMenu,
    ItemParams,
} from "react-contexify";
import "react-contexify/ReactContexify.css";

interface MenuOption {
    id: string;
    label: string;
    onClick?: (params: ItemParams) => void;
}

interface ContextMenuProps {
    menuId: string;
    options: MenuOption[];
}

export default function useContextMenu({ menuId, options }: ContextMenuProps) {
    const { show, hideAll } = useContexifyContextMenu({ id: menuId });

    const handleShowMenu = (
        event: React.MouseEvent | KonvaEventObject<MouseEvent>
    ) => {
        if ("evt" in event) {
            event.evt.preventDefault();
            show({ event: event.evt, props: { node: event.target } });
        } else {
            event.preventDefault();
            show({ event, props: { node: event.target } });
        }
    };

    const menu = (
        <Menu id={menuId} animation="fade">
            {options.map((opt) => (
                <Item key={opt.id} id={opt.id} onClick={opt.onClick}>
                    {opt.label}
                </Item>
            ))}
        </Menu>
    );

    return {
        handleShowMenu,
        menu,
        hideAll,
    };
}
