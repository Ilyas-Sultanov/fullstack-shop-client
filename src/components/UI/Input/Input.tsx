import './Input.scss';
import { InputHTMLAttributes, ChangeEvent, FocusEvent, useState, useEffect, forwardRef, memo } from "react";

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
    type?: string
    value?: string
    name: string
    messages?: string[]
    label?: string
    id?: string
    children?: never
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void
    onBlur?: (event: FocusEvent<HTMLInputElement>) => void
}

const Input = forwardRef<HTMLInputElement, IInputProps>((props: IInputProps, ref) => {
    const {type, value, name, messages, label, className, id, onChange, onBlur, ...rest} = props;
    const [val, setVal] = useState('');
    const isValid = (messages && messages.length > 0) ? false : true;
    
    useEffect(() => {
        if (value || value === '') setVal(value);
    }, [value]);

    function changeHandler(e: ChangeEvent<HTMLInputElement>) {
        if (onChange) onChange(e);
        setVal(e.target.value);
    }

    return (
        <div className="input-group input-group-sm">
            {
                label ? 
                <label className="form-label me-2 mb-0" htmlFor={id}>{label ? label : ''}</label> :
                ''
            }
            
            <input 
                ref={ref}
                id={id}
                name={name}
                type={type ? type : 'text'} 
                value={val}
                className={`form-control ${className} ${!isValid ? 'invalid' : ''}`} 
                onChange={changeHandler}
                onBlur={onBlur}
                autoComplete="off" 
                {...rest} 
            />
            {
                messages && messages.length > 0 ? 
                messages.map((m) => {
                    return <div className="invalid-feedback" style={{display: 'block'}} key={m}>{m}</div>
                }) : 
                ''
            }
        </div>
    )
});

Input.displayName = 'Input'; // Это нужно чтобы в инструментах разработчика, имя компонента, созданного при помощи функции forwardRef, отображалось корректно.


export default memo(Input);