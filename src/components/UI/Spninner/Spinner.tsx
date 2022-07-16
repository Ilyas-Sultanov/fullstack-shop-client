import { HTMLAttributes } from "react";
import './Spinner.scss';
import { ReactComponent as SpinnerIcon } from '../../../img/arrow-clockwise.svg';

interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
    children?: never
}

function Spinner({className, ...rest}: SpinnerProps) {
    return (
        <div className={`spinner ${className}`} {...rest}>
            <SpinnerIcon className="spinnerIcon" />
        </div>
    )
}

export default Spinner;