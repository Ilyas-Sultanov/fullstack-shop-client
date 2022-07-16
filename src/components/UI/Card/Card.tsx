import { ReactNode, HTMLAttributes } from "react";

interface ICardProps extends HTMLAttributes<HTMLDivElement> {
    className?: string
    children: ReactNode
}

function Card({children, className, ...rest}: ICardProps) {
    return (
        <div className={`card ${className ? className : ''}`} {...rest}>
            <div className="card-body">
                {children}
            </div>
        </div>
    )
}

export default Card;