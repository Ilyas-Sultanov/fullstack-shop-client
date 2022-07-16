import './Sidebar.scss';
import { InputHTMLAttributes, memo } from "react";
import { NavLink } from "react-router-dom";
import { ReactComponent as UserIcon } from '../../../img/people.svg';
import { ReactComponent as CategoriesIcon } from '../../../img/list-nested.svg';
import { ReactComponent as ProductsIcon } from '../../../img/archive-fill.svg';

interface SidebarProps extends InputHTMLAttributes<HTMLDivElement> {
    children?: never
}

function Sidebar({children}: SidebarProps) {
    return (
        <div className={`admin__sidebar bg-dark`}>
            <ul className="list-group list-group-flush">
                <NavLink to="users" className='list-group-item d-flex justify-content-between'>
                    <span>Users</span>    
                    <UserIcon/>
                </NavLink>
                <NavLink to="categories" className='list-group-item d-flex justify-content-between'>
                    <span>Categories</span>
                    <CategoriesIcon/>
                </NavLink>
                <NavLink to="products" className='list-group-item d-flex justify-content-between'>
                    <span>Products</span>
                    <ProductsIcon/>
                </NavLink>
            </ul>
        </div>
    )
}

export default memo(Sidebar);



// import './Sidebar.scss';
// import { ReactNode, InputHTMLAttributes, MouseEvent, useState, memo } from "react";
// import {ReactComponent as SidebarIcon} from '../../../img/list.svg';
// import {ReactComponent as CloseIcon} from '../../../img/x-lg.svg';

// interface SidebarProps extends InputHTMLAttributes<HTMLDivElement> {
//     children?: ReactNode
// }

// function Sidebar({children}: SidebarProps) {
//     const [isShow, setIsShow] = useState(false);

//     function toggleSidebar(e: MouseEvent<HTMLButtonElement>) {
//         setIsShow((prev) => {
//             return !prev;
//         })
//     }

//     return (
//         <div className={`sidebar ${isShow ? 'sidebar--show' : ''} bg-dark`}>
//             <div className="sidebar__header text-white d-flex justify-content-between align-items-center">
//                 <span className="sidebar__title mb-0">Sidebar</span>
//                 <button 
//                     className='sidebar__closeBtn' 
//                     type="button" 
//                     onClick={toggleSidebar}
//                 >
//                     {isShow ? <CloseIcon/> : <SidebarIcon/>}
//                 </button>
//             </div>
//             <div className="sidebar__body">
//                 {children}
//             </div>
//         </div>
//     )
// }

// export default memo(Sidebar);