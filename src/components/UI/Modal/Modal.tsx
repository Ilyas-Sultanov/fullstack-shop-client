import { ReactNode } from "react";
import './Modal.scss';

interface IModalProps {
    children?: ReactNode
    className?: string
    onBackdropClick: () => void
}

function Modal({onBackdropClick, className, children}: IModalProps) {
    return (
        <div className={`backdrop ${className ? className : ''}`} onClick={onBackdropClick}>
            <div className='myModal' onClick={(event) => event.stopPropagation()}>
                {children}
            </div>
        </div>
    )
}

export default Modal;




// import { FC, Fragment, ReactNode } from "react";
// import classes from './Modal.module.scss';
// import { createPortal } from "react-dom";
// import { useDispatch } from "react-redux";
// import { modalActions } from '../../../store/reducers/modal';

// interface ModalProps {
//     children?: ReactNode,
// }

// const Html: FC = ({children}) => {
//     const dispatch = useDispatch();

//     function hideModal() {
//         dispatch(modalActions.hide())
//     }

//     return (
//         <div className={classes.backdrop} onClick={hideModal}>
//             <div className={classes.modal} onClick={(event) => event.stopPropagation()}>
//                 {children}
//             </div>
//         </div>
//     )
// }

// const Modal: FC<ModalProps> = ({children}: ModalProps) => {
//     const portalElement = document.getElementById('overlays') as HTMLDivElement;

//     return (
//         <Fragment>
//             { createPortal(<Html> {children} </Html>, portalElement) }
//         </Fragment>
//     )
// }

// export default Modal;