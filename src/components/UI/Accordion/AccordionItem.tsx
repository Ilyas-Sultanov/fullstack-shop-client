import { ReactNode, useState } from 'react';
import { ReactComponent as ChevronIcon } from './img/chevron-down.svg';

type AccordionItemProps = {
    label: string
    children?: Array<ReactNode>
}

function AccordionItem({label, children}: AccordionItemProps) {
    const [isShow, setIsShow] = useState(false);

    return (
        <div className={`accordion__item ${isShow ? 'expanded' : ''}`}>
            <div 
                className='head'
                onClick={() => setIsShow(!isShow)}
            >
                <span className='label'>{label}</span>
                <ChevronIcon className='chevron-icon'/>
            </div>
            <div className='content'>
                {children}
            </div>
        </div>
    )
}

export default AccordionItem;