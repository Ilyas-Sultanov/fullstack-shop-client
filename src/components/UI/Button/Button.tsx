import { FC, ReactChild, ReactNode, MouseEvent, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    type?: "button" | "submit" | "reset";
    isDisabled?: boolean;
    children?: ReactChild | ReactNode
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

const Button: FC<ButtonProps> = ({type, className, isDisabled, children, onClick, ...rest}: ButtonProps) => {
    return (
        <button 
            type={type ? type : 'button'} 
            className={`btn ${className}`} 
            disabled={isDisabled}
            onClick={onClick}
            {...rest}
        >
            {children}
        </button>
    )
}

export default Button;