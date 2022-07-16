import { FC } from "react";
import './SpinnerModal.scss';
import { ReactComponent as SpinnerIcon } from '../../../img/arrow-clockwise.svg';
import { createPortal } from "react-dom";

const SpinnerModal: FC = () => {
    const portalElement = document.getElementById('overlays') as HTMLDivElement;

    return (
        createPortal((
            <div className="backdrop">
                <div className="spinner" onClick={(event) => event.stopPropagation()}>
                    <SpinnerIcon className={`${"spinnerIcon"}`} />
                </div>
            </div>
        ), 
        portalElement)
    )
}

export default SpinnerModal;