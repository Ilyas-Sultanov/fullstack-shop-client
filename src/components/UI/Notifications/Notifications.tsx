import { FC, Fragment } from "react";
import { useSelector } from "react-redux";
import { createPortal } from "react-dom";
import { RootState } from "../../../store/store";
import './Notifications.scss';
import NotificationsItem from "./NotificationsItem";

const Notifications: FC = () => {
    const notes = useSelector((state: RootState) => state.notifications);
    const portalElement = document.getElementById('overlays') as HTMLDivElement;

    return (
        <Fragment>
            {
                createPortal(
                    <div className="notifications">
                        {
                            notes.map((note) => {
                                return (
                                    <NotificationsItem key={note.id} {...note}/>
                                )
                            })
                        }
                    </div>, 
                    portalElement
                )
            }
       </Fragment>
    )
}

export default Notifications;