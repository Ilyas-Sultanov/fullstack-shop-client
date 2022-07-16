import './Pagination.scss';
import { ChangeEvent, Fragment, useCallback, useEffect, useState, useRef } from 'react';
import Input from "../Input/Input";
// import debounce from '../../../helpers/debounce';

type PaginationProps = {
    limit: number
    currentPage: number
    totalDocuments: number
    siblingsCount: number // сколько кнопок будут отображаться помимо текущей страницы, первой и последней
    onChangePage: (pageNumber: number) => void
    onChangePerPage: (pageLimit: number) => void
    children?: never
}

function Pagination({limit, currentPage, totalDocuments, siblingsCount, onChangePage, onChangePerPage}: PaginationProps) {
    const [visibleButtons, setVisibleButtons] = useState<Array<number>>([]);
    const totalPages = Math.ceil(totalDocuments / limit);
    const siblings = (Math.floor(siblingsCount % 2)) === 0 ? 
        Math.floor(siblingsCount) : Math.floor(siblingsCount) - 1; // Если siblingsCount не целое число, то округляем его в меньшую сторону, далее если число не четное, то вычитаем из него единицу
    const visibleButtonsCount = siblings + 1; // +1 это кнопка текущей страницы

    const perPageInputRef = useRef<HTMLInputElement>(null);
    const goToPageInputRef = useRef<HTMLInputElement>(null); 

    const calculateVisibleButtons = useCallback(() => { 
        let tempButtons: number[] = [];   
    
        for (let i=1; i <= totalPages; i++) {
            tempButtons.push(i);
        }

        if (totalPages < visibleButtonsCount) {
            ; // do nothing 
            /*
                Пустая инструкция - точка с запятой (;) оповещает о том, 
                что ни одно выражение не будет выполняться, даже если синтаксис JavaScript ожидает этого.
                https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Statements/Empty
            */
        }
        
        else if (currentPage >=1 && currentPage <= visibleButtonsCount) { 
            const sliced = [];
            for (let i=1; i <= visibleButtonsCount; i++) sliced.push(i);
            tempButtons = sliced;
        }
    
        else if (currentPage > visibleButtonsCount && currentPage < totalPages - (visibleButtonsCount - 1)) {
            const center = Math.ceil(visibleButtonsCount / 2); 
            const sliced = tempButtons.slice(currentPage - center, currentPage + (center-1));
            tempButtons = sliced; 
        }
    
        else { // if (currentPage >= totalPages - (visibleButtonsCount - 1))                
            const sliced = tempButtons.slice(totalPages - visibleButtonsCount);          
            tempButtons = sliced;                        
        }
    
        setVisibleButtons(tempButtons);
    }, [currentPage, totalPages, visibleButtonsCount]);


    useEffect(() => { 
        calculateVisibleButtons();    
    }, [calculateVisibleButtons]);


    function perPageInputHandler(e: ChangeEvent<HTMLInputElement>) {
        const newLimit = Number(e.target.value);
            if (newLimit && newLimit > 0) {
                onChangePerPage(Number(e.target.value));
            }
            else if (!newLimit) {
                return;
            }
            else {
                /**
                 * При изменении значения инпута, если оно не валидно, стейт не обновляем, 
                 * но в инпуте все-равно печатаются не валидное значение 
                 * (html атрибуты min и max работают только для стрелочек в инпуте, но не для ручного ввода), 
                 * поэтому через ref заменяем его на последнее валидное
                 */
                perPageInputRef.current!.value = `${limit}`;
            }
    }

    // const perPageInputHandler = debounce(
    //     function(e: ChangeEvent<HTMLInputElement>) {
    //         const newLimit = Number(e.target.value);
    //         if (newLimit > 0 && newLimit <= totalDocuments) {
    //             onChangePerPage(Number(e.target.value));
    //         }
    //         else {
    //             /**
    //              * При изменении значения инпута, если оно не валидно, стейт не обновляем, 
    //              * но в инпуте все-равно печатаются не валидное значение 
    //              * (html атрибуты min и max работают только для стрелочек в инпуте, но не для ручного ввода), 
    //              * поэтому через ref заменяем его на последнее валидное
    //              */
    //             perPageInputRef.current!.value = `${limit}`;
    //         }
    //     },
    //     500
    // );


    function goToPageInputHandler(e: ChangeEvent<HTMLInputElement>) {
        const newPage = Number(e.target.value);
        if (newPage && newPage > 0 && newPage <= totalPages) {
            onChangePage(Number(e.target.value));
        }
        else if (!newPage) {
            return;
        }
        else {
            /**
             * При изменении значения инпута, если оно не валидно, стейт не обновляем, 
             * но в инпуте все-равно печатаются не валидное значение 
             * (html атрибуты min и max работают только для стрелочек в инпуте, но не для ручного ввода), 
             * поэтому через ref заменяем его на последнее валидное
             */
            goToPageInputRef.current!.value = `${currentPage}`;
        }
    }
    // const goToPageInputHandler = debounce(
    //     function(e: ChangeEvent<HTMLInputElement>) {
    //         const newPage = Number(e.target.value);
    //         if (newPage > 0 && newPage <= totalPages) {
    //             onChangePage(Number(e.target.value));
    //         }
    //         else {
    //             /**
    //              * При изменении значения инпута, если оно не валидно, стейт не обновляем, 
    //              * но в инпуте все-равно печатаются не валидное значение 
    //              * (html атрибуты min и max работают только для стрелочек в инпуте, но не для ручного ввода), 
    //              * поэтому через ref заменяем его на последнее валидное
    //              */
    //             goToPageInputRef.current!.value = `${currentPage}`;
    //         }
    //     },
    //     500
    // );

    
    return (
        <div className="pagination-container">
            <div className='d-flex align-items-center perPage-container'>
                <Input 
                    ref={perPageInputRef}
                    name='limit' 
                    type='number'
                    label='Per page' 
                    value={`${limit}`}
                    className='pagination__input'
                    onChange={perPageInputHandler} // При изменении инпутов, нужно использовать debounce
                    min='1'
                    max={`${totalDocuments}`}
                />
            </div>
            
            <ul className="pagination justify-content-center mb-0">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => onChangePage(currentPage - 1)}>&laquo;</button>
                </li>

                {
                    currentPage > visibleButtonsCount ? 
                    <Fragment>
                        <li className="page-item">
                            <button className="page-link" onClick={() => onChangePage(1)}>1</button>
                        </li>
                        <li className="page-item">
                            <button className="page-link" onClick={() => onChangePage(currentPage - visibleButtonsCount)}>...</button>
                        </li> 
                    </Fragment> :
                    ''
                }              
                
                {
                    visibleButtons.map((number) => 
                        <li className={`page-item ${currentPage === number? 'active' : ''}`} key={number}>
                            <button 
                                    className="page-link" 
                                    disabled={currentPage === number}
                                    onClick={() => onChangePage(number)}
                            >
                                {number}
                            </button>
                        </li>
                    )
                }

                {
                    currentPage < totalPages - visibleButtonsCount + 1 ? 
                    <Fragment>
                        <li className="page-item">
                            <button 
                                className="page-link" 
                                onClick={() => onChangePage(currentPage + visibleButtonsCount)} // При нажатии кнопки страницы не используем debounce, поэтому запускаем onChangePeage сразу
                            >...</button>
                        </li> 
                        <li className="page-item">
                            <button 
                                className="page-link" 
                                onClick={() => onChangePage(totalPages)} // При нажатии кнопки страницы не используем debounce, поэтому запускаем onChangePeage сразу
                            >{totalPages}</button>
                        </li>
                    </Fragment> :
                    ''
                }

                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => onChangePage(currentPage + 1)}>&raquo;</button>
                </li>
            </ul>

            <div className='d-flex align-items-center goTo-container'>
                <Input 
                    ref={goToPageInputRef}
                    name='page' 
                    type='number'
                    label='Go to' 
                    value={currentPage.toString()}
                    className='pagination__input'
                    onChange={goToPageInputHandler} // При изменении инпутов, нужно использовать debounce
                    min='1'
                    max={`${totalPages}`}
                />
            </div>
        </div>
    )
}

export default Pagination;