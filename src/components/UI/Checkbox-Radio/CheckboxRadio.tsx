import { ChangeEvent, InputHTMLAttributes } from "react";

// ВНИМАНИЕ!!!!! НЕ ДЕЛАЙ event.preventDefault() radio кнопки, иначе при изменении стейта, кнопка перерендерится только после второго клика

interface checkboxRadioProps extends InputHTMLAttributes<HTMLInputElement> {
    type: 'checkbox' | 'radio'
    name: string
    label: string
    value?: string
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    checked?: boolean
    children?: never
}

function CheckboxRadio({type, name, label, value, onChange, checked, className}: checkboxRadioProps) {
    return (
        <div className={`form-check ${className ? className : ''}`}>
            <label className="form-check-label">
                {label}
                <input 
                    className="form-check-input" 
                    type={type} 
                    name={name} 
                    value={value} 
                    checked={checked} 
                    onChange={onChange}
                />
            </label>
        </div>
    )
}

export default CheckboxRadio;