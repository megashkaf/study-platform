import { LayerType } from "@/features/editor/types";

import {
    BsCardImage,
    BsFillInfoSquareFill,
    BsFillQuestionCircleFill,
    BsKeyboardFill,
} from "react-icons/bs";

interface LayerTypeIconProps {
    type: LayerType;
}

const LayerTypeIcon = ({ type }: LayerTypeIconProps) => {
    let icon = null;

    switch (type) {
        case "background":
            icon = <BsCardImage size={16} />;
            break;
        case "info":
            icon = <BsFillInfoSquareFill size={16} />;
            break;
        case "hints":
            icon = <BsFillQuestionCircleFill size={16} />;
            break;
        case "input":
            icon = <BsKeyboardFill size={16} />;
            break;
        default:
            return null;
    }

    return <div className="layer-type-icon">{icon}</div>;
};

export default LayerTypeIcon;
