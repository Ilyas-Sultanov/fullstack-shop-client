import './MultilevelMenu.scss';
import { memo, useCallback } from "react";
import Menu, {IMultilevelMenu} from './Menu';
// import useWhyDidYouUpdate from '../../../hooks/useWhyDidYouUpdate';

type MultilevelMenuProps<T> = {
    title?: string
    items: Array<IMultilevelMenu<T>>
    selectedItem?: IMultilevelMenu<T>
    onClick: (item: IMultilevelMenu<T>) => void
    children?: never
}

function MultilevelMenu<T extends IMultilevelMenu<T>>({title, items, selectedItem, onClick}: MultilevelMenuProps<T>) {

    // useWhyDidYouUpdate('MultilevelMenu', {title, items, selectedItem, onClick});

    const clickHandler = useCallback(
        function(item: IMultilevelMenu<T>) {
            onClick(item)
        },
        [onClick]
    );

    return (
        <div className='multilevel-menu'>
            {
                title ? <div>{title}</div> : ''
            }
            {
                items.length > 0 && items.map((menu) => {
                    return (
                        <Menu
                            key={menu._id}
                            item={menu}        
                            onClick={clickHandler}
                            selectedItem={selectedItem}  
                        />
                    )
                })
            }
        </div>
    )
}

export default memo(MultilevelMenu);