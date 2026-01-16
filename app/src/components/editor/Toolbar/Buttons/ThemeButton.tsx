import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { actions as themeActions } from "@/features/themes/themeSlice";

import Button from "./Button";
import { BsFillMoonFill, BsSunFill } from "react-icons/bs";

const ThemeButton = () => {
    const theme = useSelector((state: RootState) => state.theme.value);
    const dispatch = useDispatch();

    const handleClick = () => {
        dispatch(themeActions.toggleTheme());
    };

    return (
        <Button
            title="Сменить тему"
            onClick={handleClick}
            icon={
                theme === "dark" ? (
                    <BsSunFill size={28} />
                ) : (
                    <BsFillMoonFill size={28} />
                )
            }
        />
    );
};

export default ThemeButton;
