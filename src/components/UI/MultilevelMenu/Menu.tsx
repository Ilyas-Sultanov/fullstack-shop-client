import {useState, memo} from 'react'

export interface IMultilevelMenu<T> {
    name: string
    _id?: string
    children: Array<IMultilevelMenu<T>>
}

type MenuProps<T> = {
    item: IMultilevelMenu<T>
    onClick: (item: IMultilevelMenu<T>) => void
    selectedItem?: IMultilevelMenu<T>
    children?: never
}


function Menu<T extends IMultilevelMenu<T>>({item, selectedItem, onClick}: MenuProps<T>) {
    const [isExpanded, setIsExpanded] = useState(false);

    function clickHandler() {
        setIsExpanded(!isExpanded);
        onClick(item); // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! отсюда можно запустить callback
    }
   
    return (
        <ul 
            className={`menu ${isExpanded ? 'expanded' : ''}`}
        >
            <li>
                <span 
                    className={`label ${selectedItem && selectedItem.name === item.name ? 'active' : ''}`}
                    onClick={clickHandler} // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! отсюда можно запустить callback
                >
                    {item.name}
                </span>
                {
                    item.children && item.children.length > 0 &&
                    <div className="submenus">
                        {
                            item.children.map((item) => {
                                return (
                                    <Menu 
                                        key={item._id}
                                        item={item}
                                        selectedItem={selectedItem}
                                        onClick={onClick} // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! отсюда нельзя запускать callback, это просто передача параметров
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