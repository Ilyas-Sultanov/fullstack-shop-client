import './Product.scss';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct } from '../../store/reducers/product/productActionCreators';
import { RootState } from '../../store/store';
import formatCurrency from '../../helpers/formatCurrency';
import ProductImages from './ProductImages';
import ProductCounter from './ProductCounter';
import ProductSpecifications from './ProductSpecifications';

function Product() {
    const {_id} = useParams();
    const dispatch = useDispatch();
    const { product } = useSelector((state: RootState) => state.product);

    useEffect(
        function() {
            if (_id) {
                dispatch(getProduct(_id));
            }
        },
        [_id, dispatch]
    );
    

    return (
        <>
        {
            product ? 
            <div className='product'>
                <div className='product__info'>
                    <div className='product__images'>
                        <ProductImages urls={product.images}/>
                    </div>
                    <div className='product__text'>
                        <h1 className='product__title'>{product.name}</h1>
                        <span className='product__price'>Price: {formatCurrency(product.price)}</span>
                        <span className='product__warranty'>Warranty: {product.warranty} years</span>
                        <span className='product__quantity'>Quantity: {product.quantity}</span>
                        <ProductCounter
                            productId={product._id}
                            name={product.name}
                            img={product.images[0]}
                            price={product.price}
                            quantity={product.quantity}
                        />
                    </div>
                </div>

                <div className='product__description'>
                    <h4>Description:</h4>
                    {product.description}
                </div>

                <ProductSpecifications
                    properties={product.properties}
                />
            </div> :
            ''  
        }   
        </>
    )
}

export default Product;