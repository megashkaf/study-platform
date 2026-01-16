import { Canvas, ElementInspector, LayerList, SlideList } from ".";

const Editor = () => {
    return (
        <div className="editor-container divide-group-x">
            <SlideList />
            <Canvas />
            <div className="divide-group-y flex flex-col">
                <ElementInspector />
                <LayerList />
            </div>
        </div>
    );
};

export default Editor;
