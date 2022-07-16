import {IMultilevelMenu} from "./MultilevelMenu";
import {useState, MouseEvent, memo} from 'react'

type MenuProps = {
    menu: IMultilevelMenu
    onClick: (menu: IMultilevelMenu) => void
    selectedItem?: IMultilevelMenu
    children?: never
}

function Menu({menu, selectedItem, onClick}: MenuProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    function clickHandler(e: MouseEvent<HTMLSpanElement>) {
        setIsExpanded(!isExpanded);
        onClick(menu);
    }
   

    return (
        <ul 
            className={`menu ${isExpanded ? 'expanded' : ''}`}
        >
            <li>
                <span 
                    className={`label ${selectedItem && selectedItem.name === menu.name ? 'active' : ''}`}
                    onClick={clickHandler}
                >
                    {menu.name}
                </span>
                {
                    menu.subMenus && menu.subMenus.length > 0 &&
                    <div className="submenus">
                        {
                            menu.subMenus.map((menu) => {
                                return (
                                    <Menu 
                                        key={menu._id}
                                        menu={menu}
                                        selectedItem={selectedItem}
                                        onClick={onClick}
                                    />
                                )
                            })
                        }
                    </div>
                }
            </li>
        </ul>
    )
}

export default memo(Menu);