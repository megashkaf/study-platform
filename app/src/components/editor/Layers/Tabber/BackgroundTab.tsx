import { FileInput } from "@/components/Editor/inputs";

const BackgroundTab = () => {
    return (
        <div id="background">
            <div className="mb-2">
                <span>Фон:</span>
                <FileInput />
            </div>
            <div className="mb-2">
                <span>Быстрое создание фона:</span>
                <div className="custom-input" id="file">
                    <button>Выбрать</button>
                    <span>Не выбрано</span>
                </div>
            </div>
        </div>
    );
};

export default BackgroundTab;
