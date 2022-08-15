import './CreateProduct.scss';
import {useCallback, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../../../store/store';
import {createProductActions} from '../../../store/reducers/products/createProduct';
import {getCategory, createProduct} from '../../../store/reducers/products/productsTableActionCreators';
import { getBrands } from '../../../store/reducers/brands/brandsActionCreators';
import CategoriesListModal from "../Categories/CategoriesListModal";
import Button from '../../../components/UI/Button/Button';
import Input from '../../../components/UI/Input/Input';
import TextArea from '../../../components/UI/TextArea/TextArea';
import Card from '../../../components/UI/Card/Card';
import { IUICategory, FilterChoiceValue } from '../../../types/CategoryTypes';
import { ChangeEvent, FormEvent } from 'react';
import SelectWithSearch, {ISelectOption} from '../../../components/UI/SelectWithSearch/SelectWithSearch';
import UploadImages from '../../../components/UploadImages/UploadImages';
import { ICreateProductObj } from '../../../types/Products';
import Spinner from '../../../components/UI/Spninner/Spinner';
import ProductProperty from './ProductProperty';

function CreateProduct() {
    const dispatch = useDispatch();
    const {
        createProductIsLoading,
        isShowCategoryListModal,
        product,
        isValid,
    } = useSelector((state: RootState) => state.createProduct);
    
    const showModal = useCallback(
        function() {
            dispatch(createProductActions.setIsShowCategoryListModal(true));
        },
        [dispatch]
    );


    const hideCategoryModal = useCallback(
        function() {
            dispatch(createProductActions.setIsShowCategoryListModal(false));
        },
        [dispatch]
    );
  

    const selectCategory = useCallback(
        function(category: IUICategory) {
            dispatch(createProductActions.setIsShowCategoryListModal(false));
            dispatch(getCategory(category._id));
        },
        [dispatch]
    );
   

    const nameHandler = useCallback(
        function(e: ChangeEvent<HTMLInputElement>) {
            dispatch(createProductActions.setName(e.target.value));
        },
        [dispatch]
    );
  

    const descriptionHandler = useCallback(
        function(e: ChangeEvent<HTMLTextAreaElement>) {
            dispatch(createProductActions.setDescription(e.target.value));
        },
        [ dispatch]
    );
    

    const selectImages = useCallback(
        function(newFileList: FileList) {
            dispatch(createProductActions.setImageFiles(newFileList));
        },
        [dispatch]
    );
  

    const removeImage = useCallback(
        function(newFileList: FileList) {
            dispatch(createProductActions.setImageFiles(newFileList));
        }, 
        [dispatch]
    );


    const selectBrand = useCallback(
        function(selectOption?: ISelectOption) {
            if (selectOption) {
                const _id = String(selectOption['_id']);
                const name = String(selectOption['name']);
                dispatch(createProductActions.setBrand({_id, name}));
            }
            else {
                dispatch(createProductActions.setBrand(undefined));
            }
        },
        [dispatch]
    );
   

    const priceHandler = useCallback(
        function(e: ChangeEvent<HTMLInputElement>) {
            dispatch(createProductActions.setPrice(e.target.value));
        },
        [dispatch]
    );
  

    const warrantyHandler = useCallback(
        function(e: ChangeEvent<HTMLInputElement>) {
            dispatch(createProductActions.setWarranty(e.target.value));
        },
        [dispatch]
    );
   

    const quantityHandler = useCallback(
        function(e: ChangeEvent<HTMLInputElement>) {
            dispatch(createProductActions.setQuantity(e.target.value));
        },
        [dispatch]
    );
    

    const changePropHandler = useCallback(
        function(categoryPropId: string, value: FilterChoiceValue) {
            dispatch(createProductActions.setPropValue({categoryPropId, value}));
        },
        [dispatch]
    );
   

    const changeMultiselectPropHandler = useCallback(
        function(categoryPropId: string, value: FilterChoiceValue) {
            dispatch(createProductActions.setMultiselectPropValue({categoryPropId, value}));
        },
        [dispatch]
    );
   
    
    function submitHandler(e: FormEvent) {
        e.preventDefault();
        dispatch(createProductActions.validate());
    }
    

    useEffect(
        function() {
            dispatch(getBrands());
            return function() {
                dispatch(createProductActions.cleanProductState());
            }
        }, 
        [dispatch]
    );

    /**
     * Внимание!
     * При изменении стейта, происходит перерендер компонентов по умолчанию, т.е. не нужно делать useEffect для стейта.
     * useEffect используется для сайд-эффектов и асинхронных действий.
     * Здесь я использовал useEffect для стейта потомучто нужно сделать запрос на сервер, а в редьюсере редакса не может быть асинхронного кода.
     * Т.е. на submit формы я запускаю редюсер validate и если данные валидны нужно сделать запрос, но в редьюсере нельзя, поэтому если все валидно 
     * я меняю стейт isValid на true и ловлю это изменение при помощи useEffect, если isValid: true, то запускаю актион креатор на создание продукта.
     * Без useEffect запрос отпраляется несколько раз, т.е. на каждый перерендер.
     */
    useEffect(() => {
        if (isValid) {
            // const props: Array<IPreparedForUIProperty> = product.properties.map((prop) => {
            //     return {
            //         categoryPropId: prop.categoryPropId,
            //         value: prop.value,
            //         name: prop.name,
            //         filterable: prop.filterable,
            //         filterChoices: prop.filterChoices,
            //         unit: prop.unit,
            //         inputSettings: prop.inputSettings,
            //         validationMessages: prop.validationMessages,
            //     }
            // });
    
            const newProduct: ICreateProductObj = {
                name: product.name,
                category: product.category._id,
                description: product.description,
                brand: product.brand!._id,
                price: product.price,
                warranty: product.warranty,
                quantity: product.quantity,
                // rating: product.rating,
                properties: product.properties,
            }

            const formData = new FormData();
            formData.append('product', JSON.stringify(newProduct));
            if (product.images && product.images.length > 0) {
                for (let i=0; i<product.images.length; i+=1) {
                    formData.append('files', product.images[i]);
                }
            }
            dispatch(createProduct(formData));
        }
        // else {
        //     console.log('not valid');
        // }
    }, [isValid, dispatch, product]);


    return (
        <div className="create-product">
            <form onSubmit={submitHandler}>
                <Card className={`create-product__category mb-2 ${product.validationMessages.category && product.validationMessages.category.length > 0 ? 'invalid' : ''}`}>
                    <div className='mb-2'>{`Category: ${product.category.name ? product.category.name : 'Not selected'}`}</div>
                    <Button className='btn-secondary btn-sm' onClick={showModal}>Select</Button>
                    {
                        product.validationMessages.category && product.validationMessages.category.length > 0 ? 
                        product.validationMessages.category.map((msg, index) => <div key={index} className="invalid-feedback d-block">{msg}</div>) : ''
                    }
                </Card>

                <Input 
                    name='name' 
                    label='Name'
                    className='create-product__name mb-2'
                    value={product.name}
                    messages={product.validationMessages.name}
                    onChange={nameHandler}
                />     
                
                <TextArea 
                    label='Description' 
                    value={product.description}
                    className={`mb-2 create-product__description ${product.validationMessages.description && product.validationMessages.description.length > 0 ? 'invalid' : ''}`}
                    messages={product.validationMessages.description}
                    onChange={descriptionHandler}
                />

                <UploadImages 
                    label='Images' 
                    name='productImages'
                    imageFiles={product.images}
                    onChange={selectImages}
                    onRemove={removeImage}
                    multiple={true}
                />

                <div className='mb-2 d-flex align-items-end'>
                    {
                        product.category._id &&
                        <>
                            <SelectWithSearch 
                                idKey='_id'
                                labelKey='name'
                                title='Select brand'
                                placeholder=''
                                onChange={selectBrand}
                                options={product.category.brands}
                                selectedOption={product.brand} // value
                            />
                            {
                                product.validationMessages.brand &&
                                <div className="invalid-feedback d-block ms-2">{product.validationMessages.brand}</div>
                            }
                        </>
                    }
                </div>
                
                <Input 
                    type='number'
                    step={0.1}
                    name='price' 
                    label='Price (&#8381;)' // html код знака - рубль
                    className='create-product__price mb-2'
                    value={product.price.toString()}
                    messages={product.validationMessages.price}
                    onChange={priceHandler}
                />    
                
                <Input 
                    type='number'
                    step={0.1}
                    name='warranty' 
                    label='Warranty (year)'
                    className='create-product__warranty mb-2'
                    value={product.warranty.toString()}
                    messages={product.validationMessages.warranty}
                    onChange={warrantyHandler}
                />    

                <Input 
                    type='number'
                    step={1}
                    name='quantity' 
                    label='Quantity (шт)'
                    className='create-product__quantity mb-2'
                    value={product.quantity?.toString()}
                    messages={product.validationMessages.quantity}
                    onChange={quantityHandler}
                />    

                {
                    product.properties && product.properties.length > 0 ?
                    product.properties.map((prop, index) => {
                        return (
                            <ProductProperty
                                key={index}
                                property={prop}
                                onChangeProp={changePropHandler}
                                onChangeMultiselectProp={changeMultiselectPropHandler}
                            />
                        )
                    }) : null
                }

                <Button 
                    type='submit' 
                    className='btn-sm btn-success mt-2'
                >   
                    {createProductIsLoading ? <Spinner/> : 'Create'}
                </Button>
            </form>
            
            {
                isShowCategoryListModal && 
                <CategoriesListModal 
                    hideModal={hideCategoryModal} 
                    checkbox={true} 
                    onCheck={selectCategory} 
                    multipleChecked={false}
                    statuses={['leaf']} // Массив статусов, категории с такими статусами можно выбрать
                    checkedCategoryId={product.category._id}
                />
            }
        </div>
    )
}

export default CreateProduct;