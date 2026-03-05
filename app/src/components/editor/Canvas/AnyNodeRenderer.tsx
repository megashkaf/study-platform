import { AnyNodeItem } from "@/features/editor/types";
import ImageNodeRenderer from "./ImageNodeRenderer";
import TextNodeRenderer from "./TextNodeRenderer";
import MaskInputNodeRenderer from "./MaskInputNodeRenderer";
import RectInputNodeRenderer from "./RectInputNodeRenderer";

interface AnyNodeRendererProps {
    node: AnyNodeItem;
    handleShowMenu: (event: any) => void;
}

const AnyNodeRenderer = ({ node, handleShowMenu }: AnyNodeRendererProps) => {
    switch (node.type) {
        case "image":
            return <ImageNodeRenderer node={node} handleShowMenu={handleShowMenu} />;
        case "text":
            return <TextNodeRenderer node={node} handleShowMenu={handleShowMenu} />;
        case "maskInput":
            return <MaskInputNodeRenderer node={node} handleShowMenu={handleShowMenu} />;
        case "rectInput":
            return <RectInputNodeRenderer node={node} handleShowMenu={handleShowMenu} />;

        default:
            return null;
    }
};

export default AnyNodeRenderer;
