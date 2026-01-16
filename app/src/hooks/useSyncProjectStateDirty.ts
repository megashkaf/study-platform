import { selectProjectState } from "@/features/editor/selectors";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function useSyncProjectStateDirty() {
    const { isDirty } = useSelector(selectProjectState);

    useEffect(() => {
        window.electronAPI.updateProjectStateDirty(isDirty);
    }, [isDirty]);
}
