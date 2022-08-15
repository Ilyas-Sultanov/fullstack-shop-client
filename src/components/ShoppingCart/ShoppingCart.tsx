import './ShoppingCart.scss';
import { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { shoppingCartActions } from '../../store/reducers/shoppingCart/shoppingCart';
import { createOrder } from '../../store/reducers/shoppingCart/shoppingCartActionCreators';
import { authActions } from '../../store/reducers/auth/auth';
import Button from '../UI/Button/Button';
import { ReactComponent as XIcon } from '../../img/x-lg.svg';
import ShoppingCartItem from './ShoppingCartItem';
import formatCurrency from '../../helpers/formatCurrency';
import useLocalStorage from '../../hooks/useLocalStorage';
import { IShoppingCartState } from '../../store/reducers/shoppingCart/shoppingCart';
import { INewOrder } from '../../types/Order';
import SpinnerModal from '../UI/SpinnerModal/SpinnerModal';

function ShoppingCart() {
    const dispatch = useDispatch();
    const shoppingCart = useSelector((state: RootState) => state.shoppingCart);
    const { user, isShowAuthModal } = useSelector((state: RootState) => state.auth);
    const [, setCart] = useLocalStorage<IShoppingCartState>('shoppingCart', shoppingCart);

    useEffect(
        function() {
            /**
             * При изменениях в shoppingCart, добавляем/обновляем данные в LocalStorage.
             * В случае перезагрузки страницы, если в LocalStorage есть shoppingCart,
             * то эти данные запишутся в стейт (redux).
             * В редюсере shoppingCart, проверяем наличие данных в LocalStorage и помещаем в стейт
             * если они есть.
             */
            if (shoppingCart.shoppingCartItems.length > 0) {
                setCart(shoppingCart);
            }
            else {
                setCart(undefined);
            }
        },
        [shoppingCart, setCart]
    );

    const changeCount = useCallback(
        function(productId: string, count: number) {
            dispatch(shoppingCartActions.changeCount({productId, count}));
        },
        [dispatch]
    );

    const removeOne = useCallback(
        function(productId: string) {
            dispatch(shoppingCartActions.removeOne(productId));
        },
        [dispatch]
    );

    const removeAll = useCallback(
        function() {
            dispatch(shoppingCartActions.removeAll());
        },
        [dispatch]
    );


    /**
     * Сделать кнопку сохранения корзины в базу (только для активированных пользователей ?????)
     */


    const purchase = useCallback(
        function() {
            if (user) {
                const newOrder: INewOrder = {
                    userId: user._id,
                    items: shoppingCart.shoppingCartItems.map((item) => {
                        return {
                            productId: item.productId,
                            price: item.price,
                            quantity: item.count
                        }
                    }),
                    totalPrice: shoppingCart.totalPrice
                }
                
                dispatch(createOrder(newOrder));
            }
            else if (!isShowAuthModal) {
                dispatch(authActions.setIsShowAuthModal(true));
            }
        },
        [dispatch, user, isShowAuthModal, shoppingCart.shoppingCartItems, shoppingCart.totalPrice]
    );

    return (
        <div className={`shopping-cart bg-dark`}>
            <div className='shopping-cart__bts'>
                <Button
                    className='shopping-cart__close-btn'
                    onClick={() => dispatch(shoppingCartActions.setIsShowShoppingCart(false))}
                ><XIcon/></Button>

                <span className='shopping-cart__total-price'>Total price: {formatCurrency(shoppingCart.totalPrice)}</span>

                <Button 
                    className='shopping-cart__purchase btn-sm btn-success'
                    onClick={purchase}
                >Purchase</Button>

                <Button 
                    className='shopping-cart__remove btn-sm btn-danger'
                    onClick={removeAll}
                >Remove all</Button>
            </div>
            

            <div className='shopping-cart__items'>
                {
                    shoppingCart.shoppingCartItems.map((item, index) => {
                        return (
                            <ShoppingCartItem
                                key={index}
                                item={item}
                                onChangeCount={changeCount}
                                onDelete={removeOne}
                            />
                        )
                    })
                }
            </div>

            {
                shoppingCart.shoppingCartIsLoading ?
                <SpinnerModal/> : ''
            }
        </div>
    )
}

export default ShoppingCart;