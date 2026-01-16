import "./button.css";

interface ToolbarButtonProps {
    title: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    icon: React.ReactElement;
}

const Button = ({ title, onClick, icon }: ToolbarButtonProps) => {
    return (
        <button className="toolbar-button" title={title} onClick={onClick}>
            {icon}
        </button>
    );
};

export default Button;
