import { ChangeEvent, useState } from 'react';
import { ShoppingCartItem as item } from '../../store/reducers/shoppingCart/shoppingCart';
import Button from '../UI/Button/Button';
import { ReactComponent as XIcon } from '../../img/x-lg.svg';
import formatCurrency from '../../helpers/formatCurrency';
import useWhyDidYouUpdate from '../../hooks/useWhyDidYouUpdate';

type ShoppingCartItemProps = {
    item: item
    onChangeCount: (productId: string, count: number) => void
    onDelete: (productId: string) => void
}

function ShoppingCartItem({item, onChangeCount, onDelete}: ShoppingCartItemProps) {
    const [validationMessage, setValidationMessage] = useState<string>('');

    useWhyDidYouUpdate('ShoppingCartItem', {item, onChangeCount, onDelete, validationMessage});

    function changeHandler(e: ChangeEvent<HTMLInputElement>) {
        const value = Number(e.target.value);
        if (value === 0) {
            onDelete(item.productId);
            return;
        }
        if (value > 0 && value <= item.quantity) {
            onChangeCount(item.productId, value);
            if (validationMessage) setValidationMessage('');
        }
        else {
            setValidationMessage(`Min count 1, max count ${item.quantity}`);
        }
    }

    return (
        <div className='shopping-cart__item cart-item'>
            <div className='cart-item__info'>
                <img className='cart-item__img' src={item.img} alt="" />
                <span className='cart-item__name'>{item.name}</span>
            </div>

            <div className='cart-item__actions'>
                <span className='cart-item__price'>Price: {formatCurrency(item.price)}</span>
                <span>X</span>
                <input 
                    className='cart-item__input form-control' 
                    type='number'
                    value={item.count} 
                    onChange={changeHandler}
                />
                <Button 
                    className='cart-item__btn btn-sm btn-danger'
                    onClick={() => onDelete(item.productId)}
                ><XIcon/></Button>
            </div>

            {
                validationMessage ? <div className='cart-item__message'>{validationMessage}</div> : ''
            }
        </div>
    )
}

export default ShoppingCartItem;