import './CreateProduct.scss';
import {useEffect, ChangeEvent, FormEvent, useCallback} from 'react';
import {useParams} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import { IEditedProductObj} from '../../../types/Products';
import {RootState} from '../../../store/store';
import {editProductActions} from '../../../store/reducers/products/editProduct';
import {getOneProduct, editProduct} from '../../../store/reducers/products/productsTableActionCreators';
import {getCategory} from '../../../store/reducers/products/productsTableActionCreators';
import { getBrands } from '../../../store/reducers/brands/brandsActionCreators';
import CategoriesListModal from "../Categories/CategoriesListModal";
import Button from '../../../components/UI/Button/Button';
import Input from '../../../components/UI/Input/Input';
import TextArea from '../../../components/UI/TextArea/TextArea';
import Card from '../../../components/UI/Card/Card';
import UploadImages from '../../../components/UploadImages/UploadImages';
import SelectWithSearch, {ISelectOption} from '../../../components/UI/SelectWithSearch/SelectWithSearch';
import { IUICategory, FilterChoiceValue } from '../../../types/CategoryTypes';
import Spinner from '../../../components/UI/Spninner/Spinner';
import ProductProperty from './ProductProperty';

function EditProduct() {
    const dispatch = useDispatch();
    const params = useParams();
    const {
        editProductIsLoading,
        product,
        isValid,
        imageFiles,
        isShowCategoryListModal,
        // isEdited,
    } = useSelector((state: RootState) => state.editProduct);

    
    useEffect(() => {
        dispatch(getOneProduct(params.productId!));
        dispatch(getBrands());
    }, [dispatch, params.productId]);


    const nameHandler = useCallback(
        function(e: ChangeEvent<HTMLInputElement>) {
            dispatch(editProductActions.setName(e.target.value));
        },
        [dispatch]
    );
  

    const descriptionHandler = useCallback(
        function(e: ChangeEvent<HTMLTextAreaElement>) {
            dispatch(editProductActions.setDescription(e.target.value));
        }, 
        [dispatch]
    );
  

    const selectImages = useCallback(
        function(newFileList: FileList) {
            dispatch(editProductActions.setImageFiles(newFileList));
        },
        [dispatch]
    );
   

    const removeImage = useCallback(
        function(newFileList: FileList) {
            dispatch(editProductActions.removeImage(newFileList));  // Сохранение нового FileList c удаленным файлом
        },
        [dispatch]
    );
   

    const selectCategory = useCallback(
        function(category: IUICategory) {
            dispatch(editProductActions.setIsShowCategoryListModal(false));
            dispatch(getCategory(category._id));
        },
        [dispatch]
    );
    

    const showCategoryModal = useCallback(
        function() {
            dispatch(editProductActions.setIsShowCategoryListModal(true));
        },
        [dispatch]
    );
   

    const hideCategoryModal = useCallback(
        function() {
            dispatch(editProductActions.setIsShowCategoryListModal(false));
        },
        [dispatch]
    );
   
   
    const selectBrand = useCallback(
        function(selectOption?: ISelectOption) {
            if (selectOption) {
                const _id = String(selectOption['_id']);
                const name = String(selectOption['name']);
                dispatch(editProductActions.setBrand({_id, name}));
            }
            else {
                dispatch(editProductActions.setBrand(undefined));
            }
        },
        [dispatch]
    );
    

    const priceHandler = useCallback(
        function(e: ChangeEvent<HTMLInputElement>) {
            dispatch(editProductActions.setPrice(e.target.value));
        },
        [dispatch]
    );


    const warrantyHandler = useCallback(
        function(e: ChangeEvent<HTMLInputElement>) {
            dispatch(editProductActions.setWarranty(e.target.value));
        },
        [dispatch]
    );


    const quantityHandler = useCallback(
        function(e: ChangeEvent<HTMLInputElement>) {
            dispatch(editProductActions.setQuantity(e.target.value));
        },
        [dispatch]
    );
  

    const changePropHandler = useCallback(
        function(categoryPropId: string, value: FilterChoiceValue) {
            dispatch(editProductActions.setPropValue({categoryPropId, value}));
        },
        [dispatch]
    );
   

    const changeMultiselectPropHandler = useCallback(
        function(categoryPropId: string, value: FilterChoiceValue) {
            dispatch(editProductActions.setMultiselectPropValue({categoryPropId, value}));
        },
        [dispatch]
    );
    
    
    function submitHandler(e: FormEvent) {
        e.preventDefault();
        dispatch(editProductActions.validate());
    }
  

    useEffect(() => {
        if (isValid) {
            const props = product.properties.map((prop) => {
                return {
                    // categoryPropId: prop.categoryPropId,
                    // value: prop.value

                    categoryPropId: prop.categoryPropId,
                    value: prop.value,
                    name: prop.name,
                    filterable: prop.filterable,
                    filterChoices: prop.filterChoices,
                    unit: prop.unit,
                    inputSettings: prop.inputSettings,
                    validationMessages: prop.validationMessages,
                }
            });
    
            const editedProduct: IEditedProductObj = {
                _id: product._id,
                name: product.name,
                category: product.category._id,
                description: product.description,
                brand: product.brand ? product.brand._id : '',
                price: product.price,
                warranty: product.warranty,
                quantity: product.quantity,
                rating: product.rating,
                properties: props
            }
            // dispatch(edit(editedProduct));

            const formData = new FormData();
            formData.append('product', JSON.stringify(editedProduct));
            if (imageFiles && imageFiles.length > 0) {
                for (let i=0; i<imageFiles.length; i+=1) {
                    formData.append('files', imageFiles[i]);
                }
            }
            dispatch(editProduct(formData));
        }
        // else {
        //     console.log('not valid');
        // }
    }, [isValid, dispatch, product, imageFiles]);

    useEffect(() => { 
        /**
         * если поместить cleanup функцию в useEffect который выше, 
         * то она отрабатывает каждй раз при срабатывании этого (первого useEffect), 
         * а нам нужно только после ухода со страницы.
         */
        return function() {
            dispatch(editProductActions.cleanEditProductState());
        }
    }, [dispatch]);


    return (
        <div className="create-product">
            {
                editProductIsLoading ? <Spinner /> :
                <form onSubmit={submitHandler}>
                    <Card className={`create-product__category mb-2 ${product.validationMessages.category && product.validationMessages.category.length > 0 ? 'invalid' : ''}`}>
                        <div className='mb-2'>{`Category: ${product.category.name ? product.category.name : 'Not selected'}`}</div>
                        <Button className='btn-secondary btn-sm' onClick={showCategoryModal}>Select</Button>
                        {
                            product.validationMessages.category && product.validationMessages.category.length > 0 ? 
                            product.validationMessages.category.map((msg, index) => <div key={index} className="invalid-feedback">{msg}</div>) : ''
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
                        imageFiles={imageFiles}
                        onChange={selectImages}
                        onRemove={removeImage}
                        multiple={true}
                        maxFiles={10}
                    />

                    <div className='mb-2 d-flex align-items-end'>
                        <SelectWithSearch 
                            idKey='_id'
                            labelKey='name'
                            title='Select brand'
                            placeholder=''
                            onChange={selectBrand}
                            options={product.category.brands}
                            selectedOption={product.brand} // value
                        />                        
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
                        {editProductIsLoading ? <Spinner/> : 'Save'}
                    </Button>
                </form>
            }
                        
            {
                isShowCategoryListModal && 
                <CategoriesListModal 
                    hideModal={hideCategoryModal} 
                    checkbox={true} 
                    onCheck={selectCategory} 
                    multipleChecked={false}
                    statuses={['leaf']}
                    checkedCategoryId={product.category._id}
                />
            }     
        </div>
    )
}

export default EditProduct;