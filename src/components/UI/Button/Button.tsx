import { ReactNode, MouseEvent, ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    type?: "button" | "submit" | "reset";
    isDisabled?: boolean;
    children?: ReactNode
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    function({type, className, isDisabled, children, onClick, ...rest}: ButtonProps, ref) {
        return (
            <button 
                ref={ref}
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
);

Button.displayName = 'Button'; // Это нужно чтобы в инструментах разработчика, имя компонента, созданного при помощи функции forwardRef, отображалось корректно.
export default Button;