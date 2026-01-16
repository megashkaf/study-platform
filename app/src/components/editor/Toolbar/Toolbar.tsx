import { SelectButton, AddNodeButton, ZoomButtons, ThemeButton } from "./Buttons";

import "./toolbar.css";

const Toolbar = () => {
    return (
        <div className="toolbar-container">
            <div className="w-full flex justify-center">
                <SelectButton />
                <AddNodeButton />
                <ZoomButtons />
            </div>
            <div className="ml-auto">
                <ThemeButton />
            </div>
        </div>
    );
};

export default Toolbar;
