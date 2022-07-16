import './MultilevelMenu.scss';
import { memo } from "react";
import Menu from './Menu';

export interface IMultilevelMenu {
    name: string
    _id?: string
    subMenus: Array<IMultilevelMenu>
    children?: never
}

type MultilevelMenuItemProps = {
    title?: string
    items: Array<IMultilevelMenu>
    selectedItem?: IMultilevelMenu
    onClick: (selectedItem: IMultilevelMenu) => void
    children?: never
}

function MultilevelMenu({title, items, selectedItem, onClick}: MultilevelMenuItemProps) {
    return (
        <div className='multilevel-menu'>
            {
                items.length > 0 && items.map((menu) => {
                    return (
                        <Menu
                            key={menu._id}
                            menu={menu}        
                            onClick={onClick}
                            selectedItem={selectedItem}  
                        />
                    )
                })
            }
        </div>
    )
}

export default memo(MultilevelMenu);