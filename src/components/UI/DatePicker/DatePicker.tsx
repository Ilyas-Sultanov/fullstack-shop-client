import './DatePicker.scss';
import { useState, useEffect, useRef, ChangeEvent, MouseEvent, TouchEvent } from "react";
import { getYears, getWeeks, areEqual, dateIsValid, getFormatDate } from './DatePickerUtils';
import { ReactComponent as ArrowRightIcon } from './DatePickerImages/arrow-right.svg';
import { ReactComponent as ChevronRightIcon } from './DatePickerImages/chevron-right.svg';
import { ReactComponent as ChevronLeftIcon } from './DatePickerImages/chevron-left.svg';
import { ReactComponent as XIcon } from './DatePickerImages/x.svg';


type DatePickerProps = {
    selectedDates: DatePickerSelectedDates // если передан кортеж из двух дат или двух null, то можно выбирать две даты, иначе одну.
    onChange: (dates: DatePickerSelectedDates) => void
    weekStartsOnSunday?: boolean
    children?: never
}

export type DatePickerSelectedDates = [Date | null] | [Date | null, Date | null];

function DatePicker({selectedDates, onChange, weekStartsOnSunday}: DatePickerProps) {
    const [currentDate] = useState(new Date());
    const [years, setYears] = useState<Array<number>>([]); // годы отображаемые в селекте
    const [months] = useState(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']);
    const [daysOfTheWeek] = useState(weekStartsOnSunday ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
    const [weeks, setWeeks] = useState<Array<Array<Date | undefined>>>([]);
    const [startInput, setStartInput] = useState({value:'', isValid: false});
    const [endInput, setEndInput] = useState({value:'', isValid: false});
    const selectYearRef = useRef<HTMLSelectElement>(null);
    const selectMonthRef = useRef<HTMLSelectElement>(null);
    const [isShowCalendar, setIsShowCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>(currentDate); // Это только для года и месяца (то что отображается в календаре [не в селектах]) 

    useEffect(() => {
        ['click', 'touchend'].forEach((e) => {
            document.addEventListener(e, hideCalendar);
        })
        return () => {
            ['click', 'touchend'].forEach((e) => {
                document.removeEventListener(e, hideCalendar);
            })
        };
    }, []);


    useEffect(() => {
        /**
         * Если передан пропс selectedDates, то нужно установить selectedDate,
         * чтобы нужные год и месяц отображались на календаре.
         */
        if (selectedDate !== currentDate) {
            return;
            /**
             * Если есть выбранные даты, то этот if, позволяет менять selectedDate,
             * т.е. selectedDates игнорируются. 
             */
        }
        else if (selectedDates) {
            const date = selectedDates[1] && selectedDates[0];
            if (date) {
                if ( (date.getFullYear() !== selectedDate.getFullYear()) || (date.getMonth() !== selectedDate.getMonth()) ) {
                    setSelectedDate(date);
                }
            }        
        }
    }, [selectedDates, selectedDate, currentDate]);


    useEffect(() => {
        /**
         * Если передан пропс selectedDates, то нужно установить эти даты в инпуты.
         */
        if (selectedDates) {
            if (selectedDates[0]) {
                const value = getFormatDate(selectedDates[0]);
                setStartInput((prev) => {
                    return {...prev, value, isValid: true}
                });
            }
            else { // если null
                setStartInput({value:'', isValid: false});
            }

            if (selectedDates[1]) {
                const value = getFormatDate(selectedDates[1]);
                setEndInput((prev) => {
                    return {...prev, value, isValid: true}
                });
            }
            else { // если null
                setEndInput({value:'', isValid: false});
            }
        }
    }, [selectedDates]);


    useEffect(() => {
        /**
         * В селекте, отображаются предыдущие 10 лет от 
         * текущей выбранной даты (по умолчанию это текущая дата).
         * 
         * В зависимости от теущей выбранной даты, расчитываются недели,
         * сколько недель в месяце, сколько дней в месяце.
         */
        const years = getYears(selectedDate);
        const weeks = getWeeks(selectedDate.getFullYear(), selectedDate.getMonth(), weekStartsOnSunday);
        setYears(years);
        setWeeks(weeks);
    }, [selectedDate, weekStartsOnSunday]);



    function showCalendar(e: MouseEvent | TouchEvent) {
        e.stopPropagation();
        setIsShowCalendar(true);
    }


    function hideCalendar() {
        setIsShowCalendar(false);
    }


    function selectDate() {
        const year = Number(selectYearRef.current!.value);
        const month = Number(selectMonthRef.current!.value);
        const date = new Date(year, month);

        const years = getYears(date);
        const weeks = getWeeks(date.getFullYear(), date.getMonth());   

        setSelectedDate(date);
        setWeeks(weeks);
        setYears(years); 
    }


    function handleDayClick(date: Date) {
        let dates: DatePickerSelectedDates = selectedDates ? [...selectedDates] : [null];
        
        if(selectedDates && selectedDates.length === 2) {
            if (!dates[0] || dates[1]) dates = [date]; // если нет первой выбранной даты или уже есть вторая выбранная дата, значит выбираем даты заного
            else dates[1] = date; // иначе выбираем вторую дату
            if (dates[0] && dates[1]) {
                if (dates[0] > dates[1]) { // фильтруем даты по возрастанию
                    dates = [dates[1], dates[0]];
                }
            }
            onChange(dates);

            // Изменяем значения инпутов, на те что выбрали
            if (dates[0]) {
                const start = getFormatDate(dates[0]);
                setStartInput({value: start, isValid: true});
            }

            if (dates[1]) {
                const end = getFormatDate(dates[1]);
                setEndInput({value: end, isValid: true});
            }
        }
        else {
            onChange([date]);
            const start = getFormatDate(date);
            setStartInput((prev) => {
                return {...prev, value: start, isValid: true};
            });
        }
    }


    function handlePrev() {
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth() - 1;
        const newDate = new Date(year, month);
        setSelectedDate(newDate);
    }


    function handleNext() {
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth() + 1;
        const newDate = new Date(year, month);
        setSelectedDate(newDate);
    }


    function startInputHandler(e: ChangeEvent<HTMLInputElement>) {
        let value = e.target.value;
        const inputType = (e.nativeEvent as InputEvent).inputType;
        const isDeleting = inputType === 'deleteContentBackward' || inputType === 'deleteContentForward';

        if (isDeleting) { // во время удаления нам не нужна работа регулярок
            setStartInput((prev) => {
                return {...prev, value: value, isValid: false};
            });
            if (value === '') { // если инпут очистили, присваиваем null соответствующей дате в selectedDays
                onChange([null]);
            }
        } 
        else {
            /**
             * В инпуте меняем значение всегда, при этом приводим значение к виду dd/mm/yyyy,
             * и как только длина значения будет равна 10, проверяем значение на то что это валидная дата,
             * если она валидна, устанавливаем эту дату в selectedDates
             */
            
            if ((value.match(/^\d{2}$/) !== null)) { // после второго числа добавляем "/" к значению
                value = value + '/';
            } 
            else if (value.match(/^\d{2}\/\d{2}$/) !== null) { // после четвёртого числа добавляем "/" к значению
                value = value + '/';
            }
    
            setStartInput((prev) => {
                return {...prev, value: value};
            });
               
            if (value.length === 10) { //  dd/mm/yyyy (это 10 символов)
                const isValid = dateIsValid(value);
                if (isValid) {
                    let dates: DatePickerSelectedDates = selectedDates ? [...selectedDates] : [null];
                    const [day, month, year] = value.split('/');
                    dates[0] = new Date(+year, +month-1, +day); // вычитаем из месяца единицу, т.к. в инпуте меяца начинаются с 1, а мы записываем дату в объект Date
                    if ( dates[0] && dates[1] && (dates[0] > dates[1])) { // фильтруем даты по возрастанию
                        dates = [dates[1], dates[0]]; // Меняем местами даты в selectedDates
                        /**
                         * Меняем местами даты в инпутах.
                         * Пришлось брать значения для инпутов, не из самих инпутов, а из selectedDates,
                         * если брать из инпутов, то при смене значений местами, строки в инпутах отображаются не корректно.
                         */
                        const start = getFormatDate(dates[0]!); // в функции getFormatDate, к месяцу прибавляем 1, т.к. в объекте Date, меяца начинаются с 0, а мы записываем дату в инпут
                        const end = getFormatDate(dates[1]!);
                        setStartInput((prev) => {
                            return {...prev, value: start};
                        });
                        setEndInput((prev) => {
                            return {...prev, value: end};
                        });
                    }
                    onChange(dates);
                    
                    /**
                     * При смене даты через инпут, 
                     * нужно менять SelectedDate (отображаемый год и месяц календаря),
                     * если они не те же
                     */
                    if ( dates[0] && (dates[0].getFullYear() !== selectedDate.getFullYear()) && (dates[0].getMonth() !== selectedDate.getMonth()) ) {
                        const newYear = dates[0].getFullYear();
                        const newMonth = dates[0].getMonth();
                        setSelectedDate(new Date(newYear, newMonth));
                    }

                    /**
                     * Если дата валидна, то и инпут валидный
                     */
                    setStartInput((prev) => {
                        return {...prev, isValid: true}
                    });
                }
                else {
                    // console.log('NOT VALID');
                    setStartInput((prev) => {
                        return {...prev, isValid: false}
                    });
                }
            }
        }
    }


    function endInputHandler(e: ChangeEvent<HTMLInputElement>) {
        let value = e.target.value;
        const inputType = (e.nativeEvent as InputEvent).inputType;
        const isDeleting = inputType === 'deleteContentBackward' || inputType === 'deleteContentForward';

        if (isDeleting) {
            setEndInput((prev) => {
                return {...prev, value: value, isValid: false};
            });
            if (value === '') {
                onChange([null]);
            }
        } else {
            if (value.match(/^\d{2}$/) !== null) {
                value = value + '/';
            } else if (value.match(/^\d{2}\/\d{2}$/) !== null) {
                value = value + '/';
            }

            setEndInput((prev) => {
                return {...prev, value: value};
            });

            if (value.length === 10) {
                const isValid = dateIsValid(value);
                if (isValid) {
                    let dates: DatePickerSelectedDates = selectedDates ? [...selectedDates] : [null];
                    const [day, month, year] = value.split('/');
                    dates[1] = new Date(+year, +month-1, +day);
                    if ( dates[0] && dates[0] > dates[1]) {
                        dates = [dates[1], dates[0]];
                        const start = getFormatDate(dates[0]!);
                        const end = getFormatDate(dates[1]!);
                        setStartInput((prev) => {
                            return {...prev, value: start};
                        });
                        setEndInput((prev) => {
                            return {...prev, value: end};
                        });
                    }
                    onChange(dates);
                    if ( dates[1] && (dates[1].getFullYear() !== selectedDate.getFullYear()) && (dates[1].getMonth() !== selectedDate.getMonth()) ) {
                        const newYear = dates[1].getFullYear();
                        const newMonth = dates[1].getMonth();
                        setSelectedDate(new Date(newYear, newMonth));
                    }
                    setEndInput((prev) => {
                        return {...prev, isValid: true};
                    });
                }
                else {
                    // console.log('NOT VALID');
                    setEndInput((prev) => {
                        return {...prev, isValid: false};
                    });
                }
            }
        }
    }


    // function formatDate(date: Date) {
    //     const str = date.toLocaleDateString(); // возвращает дату в формате региона
    //     return str;
    // }


    function getDayClasses(date: Date) {
        let classes = 'calendar__day';

        if (areEqual(date, currentDate)) {
            classes = classes + ' today';
        } 

        if (selectedDates && selectedDates.length === 2) {
            if ( areEqual(date, selectedDates[0]!) ) classes = classes + ' selected first';
            if ( areEqual(date, selectedDates[1]!) ) classes = classes + ' selected second';
            if ( 
                (date > selectedDates[0]! && date < selectedDates[1]!) &&
                (selectedDates[0] && selectedDates[1])
            )  {
                classes = classes + ' inRange';
            }
        }
        else {
            if (selectedDates && areEqual(date, selectedDates[0]!)) {
                classes = classes + ' selected';
            }
        }

        return classes;
    }


    function clearDays(e: MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();
        setStartInput({value:'', isValid: false});
        setEndInput({value:'', isValid: false});
        onChange([null]);
    }


    return (
        <div 
            className='date-picker' 
            onClick={showCalendar} 
            onTouchEnd={showCalendar}
        >
            <div className="inputs">
                <input 
                    className={`inputs__input1 ${!startInput.isValid ? 'invalid' : 'valid'}`}
                    type='text' 
                    name='startDate' 
                    placeholder='dd/mm/yyyy'
                    value={startInput.value}
                    maxLength={10}
                    autoComplete='off'
                    onChange={startInputHandler}
                />
                {
                    selectedDates && selectedDates.length === 2 &&
                    <>
                        <ArrowRightIcon/>
                        <input 
                            className={`inputs__input2 ${!endInput.isValid ? 'invalid' : 'valid'}`}
                            type='text' 
                            name='endDate' 
                            placeholder='dd/mm/yyyy'
                            value={endInput.value}
                            maxLength={10}
                            autoComplete='off'
                            onChange={endInputHandler}
                        />
                    </>
                }
                <button className='inputs__clear-btn' onClick={(e) => clearDays(e)}><XIcon/></button>
            </div>
            {
                isShowCalendar &&
                <div className="calendar">
                    <div className="calendar__header">
                        <button 
                            className="calendar__button prev"
                            onClick={handlePrev}
                        >
                            <ChevronLeftIcon/>
                        </button>
                        <select 
                            ref={selectYearRef}
                            className='calendar__select' 
                            value={selectedDate.getFullYear()}
                            onChange={selectDate}
                        >
                            {
                                years.map((year, index) => {
                                    return (
                                        <option 
                                            key={index} 
                                            value={year}
                                        >{year}</option>
                                    )
                                })
                            }
                        </select>
                        <select 
                            ref={selectMonthRef}
                            className='calendar__select' 
                            value={selectedDate.getMonth()}
                            onChange={selectDate}
                        >
                            {
                                months.map((month, index) => {
                                    return (
                                        <option 
                                            key={index} 
                                            value={index} // value={index} - это номер месяца (в объекте Date, январь это нулевой месяц и т.д.)
                                        >{month}</option> 
                                    )
                                })
                            }
                        </select>
                        <button 
                            className='calendar__button next'
                            onClick={handleNext}
                        >
                            <ChevronRightIcon/>
                        </button>
                    </div>
                    <div className="calendar__days-of-the-week">
                        {
                            daysOfTheWeek.map((dayName, index) => {
                                return (
                                    <div key={index} className="calendar__day-of-the-week">{dayName}</div>
                                )
                            })
                        }
                    </div>
                    <div className="calendar__days-of-the-month">
                        {
                            weeks.map((week) => {
                                return week.map((date, index) => {
                                    if (date) {
                                        return (
                                            <div 
                                                key={index}
                                                className={getDayClasses(date)}
                                                onClick={() => handleDayClick(date)}
                                            >
                                                {date.getDate()}
                                            </div>
                                        )
                                    }
                                    else {
                                        return (
                                            <div key={index}></div>
                                        )
                                    }
                                })
                            })
                        }
                    </div>
                </div>
            }
            
        </div>
    )
}

export default DatePicker;




// import './DatePicker.scss';
// import { ChangeEvent } from "react";
// import Input from "../Input/Input";

// type DatePickerProps = {
//     dateFrom: string
//     dateTo: string
//     onChange: (e: ChangeEvent<HTMLInputElement>) => void
// }

// function DatePicker({ dateFrom, dateTo, onChange }: DatePickerProps) {
//     return (
//         <div className='date-picker'>
//             <div className="input-group input-group-sm mb-2">
//                 <Input 
//                     id='dateFrom'                    
//                     type='date' 
//                     label='from' 
//                     name='dateFrom'
//                     value={dateFrom}
//                     onBlur={onChange}
//                 />
                    
//             </div>
//             <div className="input-group input-group-sm">
//                 <Input 
//                     id='dateTo'
//                     type='date' 
//                     label='to' 
//                     name='dateTo'
//                     value={dateTo}
//                     onBlur={onChange}
//                 />
//             </div>
//         </div>
//     )
// }

// export default DatePicker;