import './ProductCounter.scss';
import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "../../store/store";
import Button from "../../components/UI/Button/Button";
import { shoppingCartActions } from "../../store/reducers/shoppingCart/shoppingCart";

type ProductAddToCartProps = {
    productId: string
    name: string
    img: string
    price: number
    quantity: number
}

function ProductCounter({productId, name, img, price, quantity}: ProductAddToCartProps) {
    const dispatch = useDispatch();
    const {shoppingCartItems} = useSelector((state: RootState) => state.shoppingCart);
    
    const currentItem = useMemo(
        function() {
            return shoppingCartItems.find((item) => item.productId === productId);
        },
        [shoppingCartItems, productId]
    );
   
    const increaseCount = useCallback(
        function() {
            if (currentItem && currentItem.count < quantity) {
                dispatch(shoppingCartActions.increaseCount(productId));
            }
        },
        [quantity, productId, currentItem, dispatch]
    );

    const decreaseCount = useCallback(
        function() {
            if (currentItem && currentItem.count > 0) {
                dispatch(shoppingCartActions.decreaseCount(productId));
            }
        },
        [productId, currentItem, dispatch]
    );

    return (
        <div className='product-counter'>
            {
                !currentItem ? 
                <Button 
                    className="product-card__add-btn btn-sm btn-primary"
                    onClick={() => dispatch(shoppingCartActions.addItem({productId: productId, name: name, img: img, price: price, quantity: quantity, count: 1}))}
                >Add to Cart</Button> :
                <>
                    <Button 
                        className='product-counter-btn btn-sm btn-primary'
                        onClick={decreaseCount}

                    >-</Button>
                    <span className='product-counter__number'>{currentItem?.count || 0} in cart</span>
                    <Button 
                        className='product-counter-btn btn-sm btn-primary'
                        onClick={increaseCount}
                    >+</Button>
                    <Button 
                        className='product-counter__remove-btn btn-sm btn-danger'
                        onClick={() => dispatch(shoppingCartActions.removeMany(productId))}
                    >Remove All</Button>
                </>
            }
        </div>
    )
}

export default ProductCounter;