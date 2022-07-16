import './TextArea.scss';
import { TextareaHTMLAttributes, memo } from "react";

interface ITextArea extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string
    messages?: string[]
}

function TextArea({label, messages, ...rest}: ITextArea) {
    const isValid = (messages && messages.length > 0) ? false : true;

    return (
        <div className="text-area">
            <div 
                className="text-area__label d-block"
            >
                {label}
            </div>
            <textarea className={!isValid ? 'invalid' : ''} {...rest}/>
            {
                messages && messages.length > 0 ? 
                messages.map((m) => {
                    return <div className="invalid-feedback" style={{display: 'block'}} key={m}>{m}</div>
                }) : 
                ''
            }
        </div>
    )
}

export default memo(TextArea);