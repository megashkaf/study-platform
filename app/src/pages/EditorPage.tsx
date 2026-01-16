import { useWindowTitle, useSyncProjectStateDirty, useSaveLoad } from "@/hooks";
import { Toolbar, Editor } from "@/components/editor";

import "./layout.css";

const EditorPage = () => {
    useWindowTitle();
    useSyncProjectStateDirty();
    useSaveLoad();

    return (
        <div className="app-container divide-group-y">
            <Toolbar />
            <Editor />
        </div>
    );
};

export default EditorPage;
