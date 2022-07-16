import './Dropdown.scss';
import { useState, ReactNode, useRef, useEffect } from 'react';
import Button from '../Button/Button';

interface IDropdownProps {
    children: ReactNode
    title: string
    className?: string
}

function Dropdown({children, title, className}: IDropdownProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const dropdownEl = useRef(null);

    useEffect(() => {
        document.addEventListener('click', close);
        return () => {
            document.removeEventListener('click', close);
        }
    }, []);

    function close(e: globalThis.MouseEvent) {
        if ( (e.target as HTMLElement).closest('.dropdown') !==  dropdownEl.current) {
            setIsExpanded(false);
        }
    }

    function toggle() {
        setIsExpanded((prev) => !prev);
    }

    return (
        <div className={`dropdown d-inline-block ${className}`} ref={dropdownEl}>
            <Button className='btn-sm btn-secondary text-nowrap' onClick={toggle}>{ title }</Button>
            <div className={`collapse ${isExpanded ? 'show' : ''}`} >
                <div className="card card-body">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Dropdown;