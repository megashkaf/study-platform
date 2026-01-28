import { FileInput, WindowScreenshotInput } from "@/components/Editor/inputs";

const BackgroundTab = () => {
    return (
        <div id="background">
            <div className="mb-2">
                <span>Фон:</span>
                <FileInput />
            </div>
            <div className="mb-2">
                <span>Быстрое создание фона:</span>
                <WindowScreenshotInput />
            </div>
        </div>
    );
};

export default BackgroundTab;
