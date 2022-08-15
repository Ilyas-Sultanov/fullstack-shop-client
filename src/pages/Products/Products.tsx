import './Products.scss';
import {useEffect, useCallback} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { RootState } from '../../store/store';
import debounce from '../../helpers/debounce';
import { productsActions } from '../../store/reducers/products/products';
import { notificationActions } from '../../store/reducers/notifications'; 
import { getManyProducts, getHighestPrice } from '../../store/reducers/products/productsActionCreators';
import Filter from './Filter/Filter';
import ProductCard from './ProductCard/ProductCard';
import { CSSTransition } from 'react-transition-group';
import { FilterChoiceValue, IResponseCategory } from '../../types/CategoryTypes';
import { RangeSliderValues } from '../../components/UI/RangeSlider/types';
import CategoryServices from '../../services/CategoryServices';
import useLocalStorage from '../../hooks/useLocalStorage';
import useWhyDidYouUpdate from '../../hooks/useWhyDidYouUpdate';
import { AxiosError } from 'axios';

function Products() {
    const dispatch = useDispatch();
    const [selectedCategory, setSelectedCategory] = useLocalStorage<IResponseCategory>('selectedCategory');
    const [searchParams, setSearchParams] = useSearchParams(/*{page: '1', category: `${cat ? cat._id : ''}`}*/); 
    /**
     * В компоненте CategoriesMenu, выставляются page=1&category=65111...
     * При перезагрузке страницы, page=1&category=65111... сохраняются
     */
    const {
        productsData,
        highestPrice,
        isShowFilter,
    } = useSelector((state: RootState) => state.products);
    
    useWhyDidYouUpdate('Products', {selectedCategory, searchParams, productsData, highestPrice, isShowFilter});
    
    const fetchProducts = useCallback( // eslint-disable-line react-hooks/exhaustive-deps
        debounce(
            function(queryParams: URLSearchParams) {
                dispatch(getManyProducts(queryParams));
            },
            300
        ),
        [dispatch, getManyProducts]
    );


    useEffect(() => {
        fetchProducts(searchParams);
    }, [searchParams, fetchProducts]); 

  
    useEffect(() => {
        const catId = searchParams.get('category');
        if (catId) {
            dispatch(getHighestPrice(catId));
        }
    }, [dispatch, searchParams]);


    const fetchCategory = useCallback(
        async function() {
            try {
                const catId = searchParams.get('category');
                if (catId) {
                    const response = await CategoryServices.getOne(catId);
                    const category = response.data;
                    setSelectedCategory(category);
                }
            }
            catch (err) {
                const error = err as AxiosError;
                dispatch(notificationActions.add({type: 'error', message: error.response?.data}))
            }
        },
        [dispatch, searchParams, setSelectedCategory]
    );


    useEffect(
        /**
         * Уходя со страницы Products, из localStorage удаляется selectedCategory,
         * и если мы нажмём кнопку назад (т.е. вурнуться на страницу Products), 
         * страница не найдёт selectedCategory и компонент Filter останется без 
         * пропсов. 
         * На этот случай и нужен этот запрос на сервер. 
         * 
         * P.S. selectedCategory удаляется в компоненте CategoriesMenu,
         * если делать это ТОЛЬКО из этой компоненты, то в компоненте CategoriesMenu
         * попрежнему будет выделяться категория, как будто в localStorage всё еще
         * есть selectedCategory.
         */
        function() {
            if (!selectedCategory) {
                fetchCategory();
            }
        },
        [selectedCategory, fetchCategory]
    );


    useEffect(
        // Удаление selectedCategory из localStorage
        function() {
            return () => setSelectedCategory(undefined);
        },
        [setSelectedCategory]
    );


    const toggleFilter = useCallback(
        function() {
            dispatch(productsActions.setIsShowFilter(!isShowFilter));
        },
        [dispatch, isShowFilter]
    );


    const hideFilter = useCallback(
        function() {
            dispatch(productsActions.setIsShowFilter(false));
        },
        [dispatch]
    );


    const changeDynamicFiltersHandler = useCallback(
        function(categoryPropId: string, value: FilterChoiceValue) {
            searchParams.set('page', '1');
            
            if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                const values = searchParams.getAll(categoryPropId);
                searchParams.delete(categoryPropId);
                const duplicateIdx = values.indexOf(String(value));
                if (duplicateIdx > -1) values.splice(duplicateIdx, 1);
                else values.push(String(value));
                for (let i=0; i<values.length; i+=1) {
                    searchParams.append(categoryPropId, String(values[i]));
                }                                
            }
            else if (Array.isArray(value)) {
                searchParams.set(`${categoryPropId}[gte]`, String(value[0]));
                searchParams.set(`${categoryPropId}[lte]`, String(value[1]));
            }

            setSearchParams(searchParams);
        },
        [searchParams, setSearchParams]
    );

    
    const changeBrandHandler = useCallback(
        function(brandId: string) {
            const values = searchParams.getAll('brand');
            searchParams.delete('brand');
            searchParams.set('page', '1');

            const duplicateIdx = values.indexOf(String(brandId));
            if (duplicateIdx > -1) values.splice(duplicateIdx, 1);
            else values.push(String(brandId));
            for (let i=0; i<values.length; i+=1) {
                searchParams.append('brand', String(values[i]));
            }           
            setSearchParams(searchParams);
        }, 
        [searchParams, setSearchParams]
    );


    const changePriceHandler = useCallback(
        function(values: RangeSliderValues) {
            searchParams.set('page', '1');
            searchParams.set('price[gte]', String(values[0]));
            searchParams.set('price[lte]', String(values[1]));
            setSearchParams(searchParams);
        },
        [searchParams, setSearchParams]
    );

    
    return (
        <div className='products'>
            <CSSTransition
                in={isShowFilter}
                timeout={300}
                classNames={{
                    enterActive: 'slide-right',
                    enterDone: 'show',
                    exitActive: 'slide-left',
                    exitDone: '',
                }}
            >
                <Filter 
                    className={`filter bg-dark`}
                    highestPrice={highestPrice}
                    brands={selectedCategory ? selectedCategory.brands : []}
                    properties={selectedCategory ? selectedCategory.properties : []}
                    searchParams={searchParams}
                    onToggle={toggleFilter}
                    onHide={hideFilter}
                    onChangeDynamicFilters={changeDynamicFiltersHandler}
                    onChangeBrand={changeBrandHandler}
                    onChangePrice={changePriceHandler}
                />
            </CSSTransition>
            
            <div className='products__content'>
                {
                    productsData.data.map((product) => {
                        return (
                            <ProductCard
                                key={product._id}
                                {...product}
                            />
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Products;
