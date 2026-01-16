import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectPresentationTitle } from "@/features/editor/selectors";

export default function useWindowTitle() {
    const title = useSelector(selectPresentationTitle);

    useEffect(() => {
        document.title = title;
        window.electronAPI.setWindowTitle(title);
    }, [title]);
}
