import './ProductCard.scss';
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { shoppingCartActions } from '../../../store/reducers/shoppingCart/shoppingCart';
import Button from '../../../components/UI/Button/Button';
import Card from '../../../components/UI/Card/Card';
import formatCurrency from '../../../helpers/formatCurrency';
import { IDBProduct } from '../../../types/Products';
import { RootState } from '../../../store/store';

interface IProductCardProps extends IDBProduct {
    children?: never
}

function ProductCard({_id, name, images, price, quantity}: IProductCardProps) {
    const dispatch = useDispatch();
    const {shoppingCartItems} = useSelector((state: RootState) => state.shoppingCart);

    const currentItem = useMemo(
        function() {
            return shoppingCartItems.find((item) => item.productId === _id);
        },
        [shoppingCartItems, _id]
    );

    const increaseCount = useCallback(
        function() {
            if (currentItem && currentItem.count < quantity) {
                dispatch(shoppingCartActions.increaseCount(_id));
            }
        },
        [quantity, _id, currentItem, dispatch]
    );

    const decreaseCount = useCallback(
        function() {
            if (currentItem && currentItem.count > 0) {
                dispatch(shoppingCartActions.decreaseCount(_id));
            }
        },
        [_id, currentItem, dispatch]
    );
    
    return (
        <Card className="product-card">
            <Link to={`/product/${_id}`} className='product-card__img-link'>
                <img src={images[0]} className="product-card__img" alt="product img"/>
            </Link>
            <div className="product-card__body">
                <Link to={`/product/${_id}`} className="product-card__title-link">{name}</Link>
                <span className="product-card__price">{formatCurrency(price)}</span> 
                <div className='product-card__actions'>
                    {
                        currentItem && currentItem.count > 0 ? 
                        <div className='product-card__counter'>
                            <div className='product-card__counter-inner'>
                                <Button 
                                    className='product-card__counter-btn btn-sm btn-primary'
                                    onClick={decreaseCount}

                                >-</Button>
                                <span>{currentItem?.count || 0} in cart</span>
                                <Button 
                                    className='product-card__counter-btn btn-sm btn-primary'
                                    onClick={increaseCount}
                                >+</Button>
                            </div>
                            <Button 
                                className='product-card__remove-btn btn-sm btn-danger'
                                onClick={() => dispatch(shoppingCartActions.removeMany(_id))}
                            >Remove All</Button>
                        </div> :
                        <Button 
                            className="product-card__add-btn btn-sm btn-primary"
                            onClick={() => dispatch(shoppingCartActions.addItem({productId: _id, name: name, img: images[0], price: price, quantity: quantity, count: 1}))}
                        >Add to Cart</Button>
                    }
                </div>
            </div>
        </Card>
    )
}

export default ProductCard;