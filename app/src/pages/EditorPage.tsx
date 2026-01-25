import { useWindowTitle, useSyncProjectStateDirty, useSaveLoad } from "@/hooks";
import { Editor } from "@/components/Editor";

import "./layout.css";

const EditorPage = () => {
    useWindowTitle();
    useSyncProjectStateDirty();
    useSaveLoad();

    return (
        <div className="app-container divide-group-y">
            <Editor />
        </div>
    );
};

export default EditorPage;
