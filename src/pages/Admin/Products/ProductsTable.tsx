import {useEffect, Fragment, useCallback, ChangeEvent, useMemo} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../../../store/store';
import { useSearchParams, useLocation, useNavigate, URLSearchParamsInit } from 'react-router-dom';
import { getManyProducts, deleteOneProduct, getHighestPrice} from '../../../store/reducers/products/productsTableActionCreators';
import { getBrands } from '../../../store/reducers/brands/brandsActionCreators';
import { productsTableActions } from '../../../store/reducers/products/productsTable';
import {ReactComponent as ChevronIcon} from '../../../img/chevron-down.svg';
import {ReactComponent as DeleteIcon} from '../../../img/trash.svg';
import {ReactComponent as EditIcon} from '../../../img/pencil-square.svg';
import Pagination from '../../../components/UI/Pagination/Pagination';
import Input from '../../../components/UI/Input/Input';
import Button from '../../../components/UI/Button/Button';
import DatePicker, { DatePickerSelectedDates } from '../../../components/UI/DatePicker/DatePicker';
import RangeSlider from '../../../components/UI/RangeSlider/RangeSlider';
import SelectWithSearch, {ISelectOption} from '../../../components/UI/SelectWithSearch/SelectWithSearch';
import CategoriesListModal from '../Categories/CategoriesListModal';
import formatDate from '../../../helpers/formatDate';
import debounce from '../../../helpers/debounce';
import { IUICategory } from '../../../types/CategoryTypes';

function ProductsTable() {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const {brands} = useSelector((state: RootState) => state.brands);
    const {
        isInitial,
        isShowCategoryListModal,
        productsData,
        highestPrice,
    } = useSelector((state: RootState) => state.productsTable);


    const fetchProducts = useCallback( // eslint-disable-line react-hooks/exhaustive-deps
        // eslint ругается на то что у функции, которую возвращает debounce, не определяются зависимости
        debounce(
            function(queryParams) {
                dispatch(getManyProducts(queryParams));
            },
            300
        ),
        [dispatch]
    );


    useEffect(() => {
        dispatch(getHighestPrice());
        dispatch(getBrands());
    }, [dispatch]);

        
    useEffect(() => {
        /**
         * На каждое изменение стейта searchParams, компонента ProductsTable ререндерится
         * и функция fetchProducts каждый раз новая, поэтому её оборачиваем в useCallback.
         * Функция fetchProducts должна получать новые searchParams,
         * поэтому передаем их в нее,а не обращаемся к ним напрямую из fetchProducts.
         * 
         * Внимание! 
         * Без этих действий функция debounce в fetchProducts не работает, 
         * т.к. без useCallback она будет постоянно новой.
         * Так мы избежали многократные запросы на сервер пока кнопка слайдера движется.
         */
        if (isInitial) dispatch(productsTableActions.setIsInitial(false));
        else fetchProducts(searchParams);
         /**
         * isInitial нужен для того чтобы при инициализации, не отправлялось два запроса на получение
         * всех продуктов:
         * Первый с пустыми searchParams
         * Второй с параметром query.minPice === 0 И query.maxPice === highestPrice
         * highestPrice мы получаем при инициализации и она становится значением maxPrice в searchParams,
         * и т.к. searchParams изменилось, то отправляется второй (не нужный нам) запрос.
         * Чтобы его избежать и нужен isInitial.
         */
    }, [isInitial, searchParams, fetchProducts, dispatch]); 


    const sortHandler = useCallback(
        function(columnName: string) {
            if (columnName !== 'actions') {
                const query = Object.fromEntries([...searchParams]);
                if (query.sort === columnName && query.order === '1') query.order = '-1';
                else if (query.sort === columnName && query.order === '-1') query.order = '1';
                else {
                    query.sort = columnName; 
                    query.order = '1';
                }
                setSearchParams(query);
            }
        }, 
        [searchParams, setSearchParams]
    );

  
    function navToEditPage(productId: string) {
        navigate(`${location.pathname}/edit/${productId}`, {replace: false, /*state: productId*/});
    }


    function deleteHandler(_id: string) {
        dispatch(deleteOneProduct(_id));
    }


    const priceRangeHandler = useCallback((values: Array<number>) => {
        const query = Object.fromEntries([...searchParams]); // преобразуем query параметры в объект
        query.page = '1'; // при изменениях в фильтре, всегда меняем страницу на первую
        query.minPrice = String(values[0]);
        query.maxPrice = String(values[1]);
        setSearchParams(query);
    }, [searchParams, setSearchParams]);


    const searchById = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const _id = e.target.value;
        const query = Object.fromEntries([...searchParams]);
        query.page = '1';
        if (_id !== '')  query._id = _id;
        else delete query._id;
        setSearchParams(query);
    }, [searchParams, setSearchParams]);


    const searchByName = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        const query = Object.fromEntries([...searchParams]);
        query.page = '1';
        if (name !== '') query.name = name;
        else delete query.name;
        setSearchParams(query);
    }, [searchParams, setSearchParams]);


    const searchByBrand = useCallback((selectedBrand?: ISelectOption) => {
        const query = Object.fromEntries([...searchParams]);
        query.page = '1';
        if (selectedBrand) query.brand = String(selectedBrand._id);
        else delete query.brand;
        setSearchParams(query);
    }, [searchParams, setSearchParams]);


    const searchByCategory = useCallback((category?: IUICategory) => {
        const query = Object.fromEntries([...searchParams]);
        query.page = '1';
        if (category) query.category = category._id;
        else delete query.category;
        setSearchParams(query);
    }, [searchParams, setSearchParams]);


    const searchByQuantity = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const query = Object.fromEntries([...searchParams]);
        query.page = '1';
        const value = e.target.value;
        if (value && Number(value) > -1) query.quantityLTE = value;
        else delete query.quantityLTE;
        setSearchParams(query);
    }, [searchParams, setSearchParams]);


    const searchByDate = useCallback((dates: [Date | null] | [Date | null, Date | null]) => {
        const query = Object.fromEntries([...searchParams]);
        delete query.dateFrom;
        delete query.dateTo;
        query.page = '1';
       
        if (dates[0]) {
            const year = dates[0].getFullYear();
            const month = dates[0].getMonth() < 10 ? `0${dates[0].getMonth()+1}` : dates[0].getMonth()+1;
            const day = dates[0].getDate() < 10 ? `0${dates[0].getDate()}` : dates[0].getDate();
            query.dateFrom = `${year}-${month}-${day}`;
        }
        if (dates[1]) {
            const year = dates[1].getFullYear();
            const month = dates[1].getMonth() < 10 ? `0${dates[1].getMonth()+1}` : dates[1].getMonth()+1;
            const day = dates[1].getDate() < 10 ? `0${dates[1].getDate()}` : dates[1].getDate();
            query.dateTo = `${year}-${month}-${day}`;
        }
        
        setSearchParams(query);
    }, [searchParams, setSearchParams]);

   
    const selectedDates = useMemo(() => {
        const from = searchParams.get('dateFrom');
        const to = searchParams.get('dateTo');
        
        const dates: DatePickerSelectedDates = [null, null];
        if (from) {
            const [year, month, day] = from.split('-');
            dates[0] = new Date(+year, +month-1, +day);
        }
        if (to) {
            const [year, month, day] = to.split('-');
            dates[1] = new Date(+year, +month-1, +day);
        }
        return dates;
    }, [searchParams]);

    
    const selectedBrand = useMemo(
        function() {
            const brand = brands.find((brand) => brand._id === searchParams.get('brand'));
            if (brand) return brand;
        },
        [searchParams, brands]
    );


    const clearAllFilters = useCallback(
        function() {
            const query: URLSearchParamsInit = {page: '1'};
            const limit = searchParams.get('limit');
            if (limit) query.limit = limit;
            setSearchParams(query);
        }, 
        [searchParams, setSearchParams]
    );


    const toggleCategoriesModal = useCallback(
        function() {
            dispatch(productsTableActions.isShowCategoryListModal(!isShowCategoryListModal));
        }, 
        [dispatch, isShowCategoryListModal]
    );


    const changePerPage = useCallback(
        function(pageLimit: number) {
            const query = Object.fromEntries([...searchParams]);
            query.limit = `${pageLimit}`;
            query.page = '1';
            setSearchParams(query);
        },
        [searchParams, setSearchParams]
    );


    const changePage = useCallback(
        function(pageNumber: number) {
            const query = Object.fromEntries([...searchParams]);
            query.page = `${pageNumber}`;
            setSearchParams(query);
        },
        [searchParams, setSearchParams]
    );

   
    const columns = [
        {name: '_id', label: 'Id'},
        {name: 'brand', label: 'Brand'},
        {name: 'name', label: 'Name'},
        {name: 'price', label: 'Price'},
        // {name: 'rating', label: 'Rating'},
        {name: 'category', label: 'Category'},
        {name: 'quantity', label: 'Quantity'},
        {name: 'createdAt', label: 'Created At'},
        {name: 'actions', label: 'Actions'},
    ];    

    const uiProducts = productsData.data.length > 0 ? 
    productsData.data.map((product) => {
        return {
            _id: product._id,
            category: product.category.name,
            name: product.name,
            brand: product.brand.name,
            price: product.price,
            quantity: product.quantity,
            rating: product.rating,
            createdAt: formatDate(product.createdAt)
        }
    })
    : []


    return (
        <Fragment>

        <div className="h-100 d-flex flex-column products-container">
            {
                <div className="table-responsive h-100 mb-2">
                    <table className="table table-sm table-striped table-bordered products-table">
                        <thead>
                            <tr>
                                { 
                                    columns.map((column) => {
                                        return (
                                            <th key={ column.name } onClick={() => sortHandler(column.name)}>
                                                <span className="me-2">{ column.label }</span>
                                                {
                                                    (searchParams.get('sort') === column.name && searchParams.get('order') === '1') ? 
                                                    <ChevronIcon className='chevronIcon--ascending'/> :
                                                    (searchParams.get('sort') === column.name && searchParams.get('order') === '-1') ?
                                                    <ChevronIcon className='chevronIcon--descending'/> :
                                                    ''
                                                }
                                            </th>
                                        )
                                    }) 
                                }
                            </tr>
                            <tr>
                                <td>
                                    <Input
                                        name="_id" 
                                        type="search" 
                                        value={searchParams.get("_id") || ""}
                                        onChange={searchById}
                                    />
                                </td>
                                <td>
                                    <div style={{width: '150px'}}>
                                        <SelectWithSearch
                                            idKey='_id'
                                            labelKey='name'
                                            options={brands}
                                            placeholder='All'
                                            onChange={searchByBrand}
                                            selectedOption={selectedBrand}
                                        />
                                    </div>
                                </td>
                                <td>
                                    <Input
                                        name="name" 
                                        type="search"
                                        value={searchParams.get('name') || ""}
                                        onChange={searchByName}
                                    />
                                </td>
                                <td>
                                    <div style={{width: '150px', padding: '0 15px'}}>
                                        <RangeSlider
                                            min={0}
                                            max={highestPrice !== 1 ? highestPrice : searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : 2} 
                                            /**
                                             * По умолчанию highestPrice === 1, потом с сервера приходит актуальное значение,
                                             * т.е. если еще не пришло актуальное значение, мы устанавливаем max = maxPrice,
                                             * (чтобы валидатор не ругался на минимальное значение если оно больше 1),
                                             * если highestPrice с сервера еще не пришло и нет maxPrice, делаем значение = 2, 
                                             * (2>1 и валидатор доволен, 1 - это размер шага (step) по умолчанию).
                                             */
                                            values={[
                                                searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : 0,
                                                searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : highestPrice,
                                            ]}
                                            bar={true}
                                            tip={true}
                                            onChangeValues={priceRangeHandler}
                                        />
                                    </div>
                                </td>
                                {/* <td>
                                    <RangeSlider/> rating
                                </td> */}
                                <td>
                                    <div className='category-btns'>
                                        <Button 
                                            className='btn-sm btn-primary'
                                            onClick={toggleCategoriesModal}
                                        >
                                            Categories
                                        </Button>
                                        <Button 
                                            className='btn-sm btn-secondary'
                                            onClick={() => searchByCategory()}
                                        >
                                            Clear
                                        </Button>
                                    </div>
                                </td>
                                <td>
                                    <Input
                                        name="quantity" 
                                        type="number"
                                        min={0}
                                        placeholder='lte'
                                        value={searchParams.get('quantityLTE') || ""}
                                        onChange={searchByQuantity}
                                    />
                                </td>
                                <td>
                                    <DatePicker 
                                        onChange={searchByDate}
                                        selectedDates={selectedDates}
                                    />
                                </td>
                                <td key='filter-btn'> 
                                    <Button 
                                        className='btn-secondary btn-sm text-nowrap' 
                                        onClick={clearAllFilters}
                                    > 
                                        Clear Filters
                                    </Button> 
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                uiProducts.length > 0 ?
                                uiProducts.map((prod) => {
                                    return (
                                        <tr key={prod._id}>
                                            <td>{prod._id}</td>
                                            <td>{prod.brand}</td>
                                            <td>{prod.name}</td>
                                            <td>{prod.price}</td>
                                            {/* <td>{prod.rating}</td> */} 
                                            <td>{prod.category}</td>
                                            <td>{prod.quantity}</td>
                                            <td>{prod.createdAt}</td>
                                            <td className='action-buttons'> 
                                                <Button 
                                                    className="btn-warning btn-sm" 
                                                    onClick={() => navToEditPage(prod._id)} 
                                                    value={prod._id}
                                                ><EditIcon/></Button>
                                                <Button 
                                                    className="btn-danger btn-sm" 
                                                    onClick={() => deleteHandler(prod._id)} 
                                                    value={prod._id}
                                                ><DeleteIcon/></Button>
                                            </td>
                                        </tr>
                                    )
                                }) :
                                <tr><td>Products not found</td></tr>
                            }
                        </tbody>
                    </table>
                </div> 
            }

            {
                productsData.data.length > 0 ?
                <Pagination 
                    limit={productsData.limit} 
                    currentPage={productsData.currentPage}
                    totalDocuments={productsData.totalNumberOfMatches}
                    siblingsCount={4}
                    onChangePage={changePage}
                    onChangePerPage={changePerPage}
                /> : 
                ''
            }               	
        </div>
        

        {
            isShowCategoryListModal &&
            <CategoriesListModal
                hideModal={toggleCategoriesModal}
                onCheck={searchByCategory}
                checkbox={true}
                statuses={['root', 'branch', 'leaf']} // статусы категорий, у которых будет чекбокс (т.е. эти категории можно выбирать)
                checkedCategoryId={searchParams.get('category')}
            />
        }        
        </Fragment>
    )
}

export default ProductsTable;