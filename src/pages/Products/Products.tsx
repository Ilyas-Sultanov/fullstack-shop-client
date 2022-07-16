import './Products.scss';
import {useEffect, useCallback} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useSearchParams } from 'react-router-dom';
import { RootState } from '../../store/store';
import debounce from '../../helpers/debounce';
import { productsActions } from '../../store/reducers/products/products';
import { getManyProducts, getHighestPrice } from '../../store/reducers/products/productsTableActionCreators';
import { categoriesMenuActions } from '../../store/reducers/categoriesMenu/categoriesMenu';
import { getBrands } from '../../store/reducers/brands/brandsActionCreators';

function Products() {
    const location = useLocation();
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams({page: '1', category: `${location.state}`});
    const {brands} = useSelector((state: RootState) => state.brands);
    const {
        productsData,
        highestPrice,
    } = useSelector((state: RootState) => state.products);

    // http://localhost:3000/admin/products?page=1&category=6260b4d761c57e567f4596eb
    // console.log(location);
    


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
         * На каждое изменение стейта searchParams, компонента Products ререндерится
         * и функция fetchProducts каждый раз новая, поэтому её оборачиваем в useCallback.
         * Функция fetchProducts должна получать новые searchParams,
         * поэтому передаем их в нее,а не обращаемся к ним напрямую из fetchProducts.
         * 
         * Внимание! 
         * Без этих действий функция debounce в fetchProducts не работает, 
         * т.к. без useCallback она будет постоянно новой.
         * Так мы избежали многократные запросы на сервер пока кнопка слайдера движется.
         */
        fetchProducts(searchParams);
    }, [searchParams, fetchProducts, dispatch]); 


    useEffect(
        function() {
            return () => {
                // удаляем выбранную категорию из стейта categoriesMenu, когда уходим со страницы products 
                dispatch(categoriesMenuActions.setSelectedItem(undefined));
            }
        },
        []
    );

    
    return (
        <div>
            <div>Products</div>
        </div>
    )
}

export default Products;
