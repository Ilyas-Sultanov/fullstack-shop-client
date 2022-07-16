import './SelectWithSearch.scss';
import { useState, useRef, useEffect } from "react";

export interface ISelectOption extends Record<string, string | number> {}

type SelectProps = {
    idKey: string // имя поля у option, значение которого будет уникальным идентификатором
    labelKey: string // имя поля у option, значение которого будет отображаться в теге option
    title?: string
    placeholder: string // можно пустую строку
    options: ISelectOption[]
    onChange: (selectedOption?: ISelectOption) => void
    selectedOption?: ISelectOption
    children?: never
}

function SelectWithSearch({title, placeholder = 'Select option', options, onChange, selectedOption, idKey, labelKey}: SelectProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
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
        setOpen(e && e.target === ref.current);
    }

    function selectOption(option: ISelectOption) {
        setQuery(''); // При выборе option, удаляем query, чтобы в инпуте всё отображалось корректно
        onChange(option);
        setOpen(false);
    }

    function filter(options: ISelectOption[]) {
        return options.filter((option) => {
            return option[labelKey].toString().toLowerCase().indexOf(query.toLowerCase()) > -1;
        });
    }

    function displayValue() {
        if (query.length > 0) return query;
        if (selectedOption) return selectedOption[labelKey];
        return '';
    }

    return (
        <div className='select-with-search'>
            <div className="title">{title}</div>
            
            <div className="control">
                <div className="selected-value">
                    <input 
                        type="text"
                        ref={ref}
                        placeholder={selectedOption ? selectedOption[labelKey].toString() : placeholder}
                        value={displayValue()}
                        onChange={(e) => {
                            setQuery(e.target.value)
                            onChange(undefined) // Когда печатаем в инпуте, удаляем выбранный option, чтобы в инпуте всё отображалось корректно
                        }}
                        onClick={(e) => toggle(e.nativeEvent)}
                        onTouchEnd={(e) => toggle(e.nativeEvent)}
                    />
                    <div className={`arrow ${open ? 'open' : ''}`}></div>
                </div>
            </div>

            <div className={`options ${open ? 'open' : ''}`}>
                {
                    filter(options).map((option) => {
                        return (
                            <div 
                                key={option[idKey]}
                                className={`option ${option[idKey] === selectedOption?.[idKey] ? 'selected' : ''}`}
                                onClick={() => selectOption(option)}
                                onTouchEnd={() => selectOption(option)}
                            >
                                {option[labelKey]}
                            </div>
                        )
                    })
                }
            </div>

        </div>
    )
}

export default SelectWithSearch;






// import './SelectWithSearch.scss';
// import { ChangeEvent } from "react";

// export type SelectOptionType = {_id: string, name: string,}

// type SelectProps = {
//     name: string
//     label?: string
//     value: string 
//     options: SelectOptionType[]
//     onChange: (selectedOptionId: string) => void
//     className?: string
//     messages?: string[]
//     children?: never
// }

// function Select({name, value, label, options, className, messages, onChange}: SelectProps, {...rest}) {

//     function changeHandler(e: ChangeEvent<HTMLSelectElement>) {
//         const optionId = e.target.options[e.target.selectedIndex].dataset._id;
//         onChange(optionId!);
//     }
    
//     return (
//         <div className={`select input-group input-group-sm ${className ? className : ''}`}>
//             <div>
//                 {label ? <div>{label}</div> : ''}
//                 <select 
//                     value={value} 
//                     name={name} 
//                     className={`form-select form-select-sm ${className} ${messages && messages.length > 0 ? 'invalid' : ''}`} 
//                     onChange={changeHandler} 
//                     {...rest} 
//                 >
//                     {
//                         options.map((item) => {
//                             return (
//                                 <option 
//                                     key={item._id} 
//                                     data-_id={item._id}
//                                     value={item.name}
//                                 >{item.name}</option>
//                             )
//                         })
//                     }
//                 </select>
//                 {
//                 messages && messages.length > 0 ? messages.map((m) => {
//                     return <div className="invalid-feedback" style={{display: 'block'}} key={m}>{m}</div>
//                 }) : 
//                 ''
//             }
//             </div>
//         </div>
//     )
// }

// export default Select;