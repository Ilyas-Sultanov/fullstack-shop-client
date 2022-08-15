import './MultiSelect.scss';
import { useState, useEffect, MouseEvent, useCallback } from "react";
import { ReactComponent as XSmallIcon } from './img/x.svg';
import { ReactComponent as XLargIcon } from './img/x-lg.svg';
import { ReactComponent as ChevronIcon } from './img/chevron-down.svg';
import Button from '../../../components/UI/Button/Button';

type MultiSelectProps<T> = {
    idKey: string // имя поля у option, значение которого будет уникальным идентификатором
    labelKey: string // имя поля у option, значение которого будет отображаться в теге option
    title?: string
    options: T[]
    onSelect: (option: T) => void
    onUnselect: (option: T) => void
    onClear: () => void
    selectedOptions: Array<T>
    className?: string
    children?: never
}

function MultiSelect<T extends Record<string, string | number>>({title, options, onSelect, onUnselect, onClear, selectedOptions, idKey, labelKey, className}: MultiSelectProps<T>) {
    const [isOpen, setIsOpen] = useState(false);   

    useEffect(() => {
        ['click', 'touchend'].forEach((e) => {
            document.addEventListener(e, close);
        })
        return () => {
            ['click', 'touchend'].forEach((e) => {
                document.removeEventListener(e, close);
            })
        };
    }, []);


    function close(e: Event) {
        if (!(e.target as HTMLElement).closest('.multiselect')) {
            setIsOpen(false);
        }
    }

    const toggle = useCallback(
        function() {
            setIsOpen(!isOpen);
        },
        [isOpen]
    );

    const clear = useCallback(
        function(e: MouseEvent<HTMLButtonElement>) {
            e.stopPropagation();
            if (isOpen) {
                setIsOpen(false);
            }
            onClear();
        },
        [onClear, isOpen]
    );

    function selectOption(option: T) {
        onSelect(option);
    }


    function unselect(e: MouseEvent<HTMLButtonElement>, option: T) {
        e.stopPropagation();
        onUnselect(option);
    }
  

    return (
        <div className={`multiselect ${className ? className : ''}`}>
            <div className="title">{title}</div>
            
            <div className="control">
                <div className="selected-value">
                    <div 
                        className='pseudo-input'
                    >
                        {
                            selectedOptions.map((option, index) => {
                                return (
                                    <div key={index} className='selected-option-name'>
                                        <span>{option.name}</span>
                                        <Button 
                                            className='delete-option-btn' 
                                            onClick={(e) => unselect(e, option)}
                                        ><XSmallIcon/></Button>
                                    </div>
                                )
                            })
                        }

                        <div className='control-btns'>
                            <Button 
                                onClick={clear}
                            ><XLargIcon/></Button>
                            <Button 
                                className={`arrow ${isOpen ? 'open' : ''}`} 
                                onClick={toggle}
                            ><ChevronIcon/></Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`options ${isOpen ? 'open' : ''}`}>
                {
                    options.map((option) => {
                        return (
                            <div 
                                key={option[idKey]}
                                className={`option ${selectedOptions.length > 0 && selectedOptions.find((item) => item[idKey] === option[idKey]) ? 'selected' : ''}`}
                                onClick={() => selectOption(option)}
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

export default MultiSelect;