import { ReactNode } from 'react';
import './Accordion.scss';

type AccordionProps = {
    items: Array<ReactNode>
}

function Accordion({items}: AccordionProps) {

    return (
        <div className='accordion'>
            {
                items.map((item) => {
                    return (
                        item
                    )
                })
            }
        </div>
    )
}

export default Accordion;