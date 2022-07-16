import { FC, useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { notificationActions, NoteType } from "../../../store/reducers/notifications";
import './NotificationsItem.scss';

type NotificationsProps = {
    id: string;
    type: NoteType;
    message: string;
}

const NotificationsItem: FC<NotificationsProps> = ({id, type, message}: NotificationsProps) => {
    const [width, setWidth] = useState(0);
    const [intervalId, setIntervalId] = useState(null as null | number);
    const [isHide, setIsHide] = useState(false);
    const dispatch = useDispatch();

    const pauseTimer = useCallback(() => {
        clearInterval(intervalId!);
    }, [intervalId]);

    const removeNotification = useCallback(() => {
        pauseTimer();
        setIsHide(true);
        setTimeout(() => {
        dispatch(notificationActions.remove(id))
        }, 400);
    }, [dispatch, pauseTimer, id]);

    useEffect(() => {
        startTimer();
    }, []);

    useEffect(() => {
        if (width === 100) {
            removeNotification();
        }
    }, [width, removeNotification]);

    function startTimer() {
        const id = window.setInterval(() => { // если не указывать window, то у id будет тип NodeJS.Timer а не number
            setWidth((prevWidth) => {
                if (prevWidth < 100) {
                    return prevWidth + 0.5
                }
                clearInterval(id)
                return prevWidth;
            });
        }, 20);

        setIntervalId(id);
    };

    function removeNow() {
        dispatch(notificationActions.remove(id));
    }

    return (
        <div 
            className={`notification ${type} ${isHide ? 'hide' : ''}`} 
            onMouseEnter={pauseTimer} 
            onMouseLeave={startTimer}
        >
            <div className="toast-header">
                {/* <img src="..." className="rounded me-2" alt="..."/> */}
                <strong className="me-auto">{type}</strong>
                {/* <small className="text-muted">прямо сейчас</small> */}
                <button className="btn-close" onClick={removeNow}></button>
            </div>
            <div className="toast-body">
                {message}
            </div>
            <div className='bar' style={{width: `${width}%`}} />
        </div>

        // <div 
        //     className={`notification ${type} ${isHide ? 'hide' : ''}`} 
        //     onMouseEnter={pauseTimer} 
        //     onMouseLeave={startTimer}
        // >
        //     <div className="notification-header d-flex justify-content-between">
        //         <div className="notification-type">{type}</div>
        //         <button onClick={removeNow}>Close</button>
        //     </div>
        //     <p>{message}</p>
        //     <div className='bar' style={{width: `${width}%`}} />
        // </div>
    )
}

export default NotificationsItem;