import './CreateProduct.scss';
import {useEffect, ChangeEvent, FormEvent, useCallback} from 'react';
import {useParams} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import { IEditedProductObj } from '../../../types/Products';
import {RootState} from '../../../store/store';
import {editProductActions} from '../../../store/reducers/products/editProduct';
import {getOneProduct, editProduct} from '../../../store/reducers/products/productsTableActionCreators';
import {getCategory} from '../../../store/reducers/products/productsTableActionCreators';
import { createBrand, getBrands, editBrand, deleteBrand } from '../../../store/reducers/brands/brandsActionCreators';
import CategoriesListModal from "../Categories/CategoriesListModal";
import BrandsModal from './brandsModal';
import Button from '../../../components/UI/Button/Button';
import Input from '../../../components/UI/Input/Input';
import TextArea from '../../../components/UI/TextArea/TextArea';
import Card from '../../../components/UI/Card/Card';
import CheckboxRadio from '../../../components/UI/Checkbox-Radio/CheckboxRadio';
import UploadImages from '../../../components/UI/UploadImages/UploadImages';
import SelectWithSearch, {ISelectOption} from '../../../components/UI/SelectWithSearch/SelectWithSearch';
import { IUICategory } from '../../../types/CategoryTypes';
import Spinner from '../../../components/UI/Spninner/Spinner';

function EditProduct() {
    const dispatch = useDispatch();
    const params = useParams();
    const {
        editProductIsLoading,
        product,
        isValid,
        imageFiles,
        isShowCategoryListModal,
        isShowBrandsModal,
        // isEdited,
    } = useSelector((state: RootState) => state.editProduct);

    const {brands, brandsIsLoading} = useSelector((state: RootState) => state.brands);

    
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
            dispatch(getCategory(category._id)); // внимание! диспатчим не сервис, а action creator
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
   

    const showBrandsModal = useCallback(
        function() {
            dispatch(editProductActions.setIsShowBrandsModal(true));
        },
        [dispatch]
    );
  

    const hideBrandsModal = useCallback(
        function() {
            dispatch(editProductActions.setIsShowBrandsModal(false));
        },
        [dispatch]
    );


    const createBrandHandler = useCallback(
        function(name: string) {
            dispatch(createBrand(name));
        },
        [dispatch]
    );


    const editBrandHandler = useCallback(
        function(name: string, brandId: string) {
            const targetBrand = brands.find((brand) => {
                return brand._id === brandId;
            });
            if (targetBrand) {
                dispatch(editBrand(targetBrand._id, name));
            }
        },
        [dispatch, brands]
    );


    const deleteBrandHandler = useCallback(
        function(brandId: string) {
            dispatch(deleteBrand(brandId));
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
  

    const stringPropHandler = useCallback(
        function(e: ChangeEvent<HTMLInputElement>, categoryPropId: string) {
            const value = e.target.value;
            dispatch(editProductActions.setPropValue({categoryPropId, value}));
        },
        [dispatch]
    );

    const numericPropHandler = useCallback(
        function(e: ChangeEvent<HTMLInputElement>, categoryPropId: string) {
            const value = Number(e.target.value);
            dispatch(editProductActions.setPropValue({categoryPropId, value}));
        },
        [dispatch]
    );
   

    const booleanPropHandler = useCallback(
        function(e: ChangeEvent<HTMLInputElement>, categoryPropId: string) {
            const value = e.target.value === 'true' ? true : false;
            dispatch(editProductActions.setPropValue({categoryPropId, value}));
        },
        [dispatch]
    );
    

    const multiselectPropHandler = useCallback(
        function(e: ChangeEvent<HTMLInputElement>, categoryPropId: string) {
            const value = e.target.value;
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
                    categoryPropId: prop.categoryPropId,
                    value: prop.value
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
                        {
                            brandsIsLoading ? <Spinner/> :
                            <>
                                <SelectWithSearch 
                                    idKey='_id'
                                    labelKey='name'
                                    title='Select brand'
                                    placeholder=''
                                    onChange={selectBrand}
                                    options={brands}
                                    selectedOption={product.brand} // value
                                />
                                <Button className='btn-sm btn-secondary ms-2' onClick={showBrandsModal}>Brands</Button>
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
                                <div key={index}>
                                    {
                                        prop.type === 'String' && prop.filterable ?  // если пропс фильтруемый
                                        <Card className='mb-2'>
                                            <div>{prop.name}</div>
                                            {
                                                prop.filterChoices && prop.filterChoices.length > 0 ?
                                                prop.filterChoices.map((choice, index) => {
                                                    return (
                                                        <CheckboxRadio 
                                                            key={index} 
                                                            type={prop.isMultiselect ? 'checkbox' : 'radio'} // если prop.isMultiselect, то у продукта - массив значений, поэтому checkbox а не radio
                                                            name={prop.isMultiselect ? '' : prop.name} 
                                                            label={choice.name} 
                                                            value={choice.value.toString()}
                                                            checked={
                                                                prop.isMultiselect ? 
                                                                (prop.value as string[]).includes(choice.value as string) : 
                                                                choice.value === prop.value
                                                            }
                                                            onChange={(e) => {
                                                                if (prop.isMultiselect) multiselectPropHandler(e, prop.categoryPropId)
                                                                else stringPropHandler(e, prop.categoryPropId)
                                                            }}
                                                        />
                                                    )
                                                }) : null
                                            }
                                            <div className='invalid-feedback d-block'>
                                                {
                                                    prop.validationMessages.length > 0 ?
                                                    prop.validationMessages.map((msg, index) => {
                                                        return (
                                                            <div key={index}>{msg}</div>
                                                        )
                                                    }): null
                                                }
                                            </div>
                                        </Card> :
                                        prop.type === 'Number' && prop.filterable ? 
                                        <div className='mb-2'>
                                            <div>{prop.name}</div>
                                            {
                                                prop.filterChoices && prop.filterChoices.length > 0 ?
                                                <Input 
                                                    type='number' 
                                                    step={0.0000001}
                                                    name='' 
                                                    value={prop.value.toString()} 
                                                    onChange={(e) => numericPropHandler(e, prop.categoryPropId)}
                                                /> :
                                                prop.filterChoices ? prop.filterChoices.map((choice, index) => {
                                                    return (
                                                        <CheckboxRadio 
                                                            key={index} 
                                                            type='radio' 
                                                            name={prop.name} 
                                                            label={choice.name} 
                                                            value={choice.value.toString()} 
                                                            checked={choice.value === prop.value}
                                                            onChange={(e) => numericPropHandler(e, prop.categoryPropId)}
                                                        />
                                                    )
                                                }) : null
                                            }
                                            <div className='invalid-feedback d-block'>
                                                {
                                                    prop.validationMessages.length > 0 ?
                                                    prop.validationMessages.map((msg) => {
                                                        return (
                                                            <div key={index}>{msg}</div>
                                                        )
                                                    }): null
                                                }
                                            </div>
                                        </div> :
                                        prop.type === 'Boolean' ? // boolean не фильтруемый всегда
                                        <Card className='mb-2'>
                                            <div>{prop.name}</div>
                                            <div>
                                                <CheckboxRadio 
                                                    type='radio' 
                                                    name={prop.name} 
                                                    label='Yes'
                                                    value='true'
                                                    checked={prop.value === true}
                                                    onChange={(e) => {booleanPropHandler(e, prop.categoryPropId)}}
                                                />
                                                <CheckboxRadio 
                                                    type='radio' 
                                                    name={prop.name} 
                                                    label='No' 
                                                    value='false'
                                                    checked={prop.value === false || prop.value === ''}
                                                    onChange={(e) => booleanPropHandler(e, prop.categoryPropId)}
                                                />
                                            </div>
                                        </Card> :
                                        // если пропс не фильтруемый
                                        prop.type === 'Number' ? 
                                        <Input 
                                            type='number' 
                                            name='' 
                                            value={`${prop.value}`}
                                            label={prop.name} 
                                            className='mb-2' 
                                            onChange={(e) => numericPropHandler(e, prop.categoryPropId)}
                                        /> :
                                        <Input 
                                            type='text' 
                                            name='' 
                                            value={`${prop.value}`}
                                            label={prop.name} 
                                            className='mb-2' 
                                            onChange={(e) => stringPropHandler(e, prop.categoryPropId)}
                                        />
                                    }
                                </div>
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

            {
                isShowBrandsModal && 
                <BrandsModal 
                    isLoading={brandsIsLoading}
                    brands={brands}
                    onCreateBrand={createBrandHandler}
                    onEditBrand={editBrandHandler}
                    onDeleteBrand={deleteBrandHandler}
                    onBackdropClick={hideBrandsModal}
                /> 
            } 
        </div>
    )
}

export default EditProduct;