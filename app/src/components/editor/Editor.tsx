import { Toolbar, Canvas, ElementInspector, SlideList, Tabber } from ".";

const Editor = () => {
    return (
        <>
            <Toolbar />
            <div className="editor-container divide-group-x">
                <SlideList />
                <Canvas />
                <div className="sidebar-container divide-group-y flex flex-col">
                    <Tabber />
                    <ElementInspector />
                </div>
            </div>
        </>
    );
};

export default Editor;
