import { useWindowTitle, useSyncProjectStateDirty, useSaveLoad } from "@/hooks";
import { Editor, Player } from "@/components/Editor";

import { selectPlayerState } from "@/features/editor/selectors";
import { useSelector, useDispatch } from "react-redux";

import "./layout.css";

import { useEffect } from "react";
import { actions as editorActions } from "@/features/editor/editorSlice";

const EditorPage = () => {
    const dispatch = useDispatch();
    const { playerState } = useSelector(selectPlayerState);

    useWindowTitle();
    useSyncProjectStateDirty();
    useSaveLoad();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "F11") {
                e.preventDefault();
                dispatch(editorActions.setPlayerState(!playerState.isVisible));
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [playerState]);

    return (
        <>
            <div className="app-container divide-group-y">
                <Editor />
            </div>
            {playerState.isVisible && <Player />}
        </>
    );
};

export default EditorPage;
