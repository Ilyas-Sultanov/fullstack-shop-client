import './DropdownMenu.scss';
import { useState, useRef, useEffect } from "react";

export interface IDropdownMenuItem extends Record<string, string | number> {}

type DropdownMenuProps = {
    idKey: string // имя поля у item, значение которого будет уникальным идентификатором
    labelKey: string // имя поля у item, значение которого будет отображаться
    title?: string
    label: string
    menuItems: IDropdownMenuItem[]
    onClick: (selectedItem: IDropdownMenuItem) => void
    selectedItem?: IDropdownMenuItem
    children?: never
}

function DropdownMenu({title, label, menuItems, onClick, selectedItem, idKey, labelKey}: DropdownMenuProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);  

    useEffect(() => {
        ['click', 'touchend'].forEach((e) => {
            document.addEventListener(e, toggle);
        })
        return () => {
            ['click', 'touchend'].forEach((e) => {
                document.removeEventListener(e, toggle);
            })
        };
    }, []);

    function toggle(e: Event) {
        const currentControl = (e.target as HTMLElement).closest('.control');
        if (currentControl && currentControl === ref.current) {
            setOpen(true);
        }
        else {
            setOpen(false);
        }
    }

    function selectItem(item: IDropdownMenuItem) {
        onClick(item);
        setOpen(false);
    }

    
    return (
        <div className='dropdownMenu'>
            {title && <div className="title">{title}</div>}
                
            <div 
                ref={ref}
                className="control"  
                onClick={(e) => toggle(e.nativeEvent)}
            >
                <div className="label">
                    <div >{label}</div>
                    <div className={`arrow ${open ? 'open' : ''}`}></div>
                </div>
            </div>
            {
                menuItems.length > 0 &&
                <div className={`items ${open ? 'open' : ''}`}>
                {
                    menuItems.map((item) => {
                        return (
                            <div 
                                key={item[idKey]}
                                className={`item ${item[idKey] === selectedItem?.[idKey] ? 'selected' : ''}`}
                                onClick={() => selectItem(item)}
                                onTouchEnd={() => selectItem(item)}
                            >
                                {item[labelKey]}
                            </div>
                        )
                    })
                }
                </div>
            }
        </div>
    )
}

export default DropdownMenu;