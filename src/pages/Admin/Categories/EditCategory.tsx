import React, {useEffect, useState, ChangeEvent, FormEvent, useCallback, useMemo} from 'react';
import {useParams} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CategoryServices from '../../../services/CategoryServices';
import {v4} from 'uuid';
import { AxiosError } from 'axios';
import { notificationActions } from '../../../store/reducers/notifications';
import { getBrands } from '../../../store/reducers/brands/brandsActionCreators';
import { IUICategory, IEditedCategory, IUIProperty, PropertyType, CategoryStatusType, IUIFilterChoice } from "../../../types/CategoryTypes";
import Spinner from '../../../components/UI/Spninner/Spinner';
import CheckboxRadio from '../../../components/UI/Checkbox-Radio/CheckboxRadio';
import Input from '../../../components/UI/Input/Input';
import TextArea from '../../../components/UI/TextArea/TextArea';
import Button from '../../../components/UI/Button/Button';
import MultiSelect from '../../../components/UI/MultiSelect/MultiSelect';
import CategoryProperty from './CategoryProperty';
import CategoriesListModal from './CategoriesListModal';
import Card from '../../../components/UI/Card/Card';
import UploadImages from '../../../components/UploadImages/UploadImages';
import BrandsModal from './brandsModal';
import {urlToFile} from '../../../helpers/urlToFile';
import { RootState } from '../../../store/store';
import { DBBrand } from '../../../types/Brand';
import useWhyDidYouUpdate from '../../../hooks/useWhyDidYouUpdate';

function EditCategory() {
    const params = useParams();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState('');
    const [parentMessage, setParentMessage] = useState('');
    const [properties, setProperties] = useState<IUIProperty[]>([]);
    const [isShowCategoriesListModal, setIsShowCategoriesListModal] = useState(false);   
    const [isShowBrandsModal, setIsShowBrandsModal] = useState(false);

    const [categoryId, setCategoryId] = useState('');
    const [parent, setParent] = useState({_id: '', name: ''});
    const [categoryName, setCategoryName] = useState<{value: string, validationMsgs: string[]}>({value: '', validationMsgs: []});
    const [description, setDescription] = useState<{value: string, validationMsgs: string[]}>({value: '', validationMsgs: []});
    const [originalStatus, setOriginalStatus] = useState<CategoryStatusType>();
    const [status, setStatus] = useState<CategoryStatusType>();
    const [imageFiles, setImageFiles] = useState<FileList | undefined>();
    const [categoryBrands, setCategoryBrands] = useState<Array<DBBrand>>([]);
    const {brands} = useSelector((state: RootState) => state.brands);

    useWhyDidYouUpdate('EditCategory', {
        params,
        isLoading,
        statusMessage,
        parentMessage,
        properties,
        categoryId,
        parent,
        categoryName,
        description,
        originalStatus,
        status,
        imageFiles
    });


    const catId = useMemo( // почемуто после редактирования категории или ее свойств, params меняется. Пришлось поместить в useMemo, что небыло ререндера 
        function() {
            return params.categoryId;
        },
        [params]
    );


    const getCategory = useCallback(
        async function() {
            try {
                const response = await CategoryServices.getOne(catId!); // Если сюда поместить params.categoryId напрямую, будет лишний ререндер.
                const category = response.data;           
    
                if (category) {
                    setCategoryId(category._id);
                    setCategoryName({value: category.name, validationMsgs: []});
                    setDescription({value: category.description, validationMsgs: []});
                    setOriginalStatus(category.status);
                    setStatus(category.status);
                    if (category.img) {
                        const imageFileList = await urlToFile([category.img]);
                        setImageFiles(imageFileList);
                    }
                    if (category.parent) {
                        setParent(category.parent);
                    }
                    if (category.brands) {
                        setCategoryBrands(category.brands);
                    }
                    if (category.properties) {
                        const uiProps: IUIProperty[] = category.properties.map((prop) => {
        
                            let uiFilterChoices: IUIFilterChoice[] = [];
        
                            if (prop.filterChoices && prop.filterChoices.length > 0) {
                                uiFilterChoices = prop.filterChoices.map((choice) => {
                                    return {
                                        ...choice,
                                        key: v4(),
                                        validationObj: {}
                                    }
                                })
                            }
        
                            const uiProp : IUIProperty = {
                                ...prop,
                                key: v4(),
                                filterChoices: uiFilterChoices,
                                validationObj: {}
                            }
        
                            return uiProp
                        });
                        
                        setProperties(uiProps);
                    }
                }
            }
            catch (err) {
                const error = err as AxiosError;
                dispatch(notificationActions.add({type: 'error', message: error.response?.data}))
            }
            finally {
                setIsLoading(false);
            }
        },
        [dispatch, catId]
    );
    
 
    useEffect(() => {
        getCategory()
    }, [getCategory]);


    useEffect(
        function() {
            dispatch(getBrands());
        },
        [dispatch]
    );
    
    const categoryNameHandler = useCallback(
        function(e: ChangeEvent<HTMLInputElement>) {
            setCategoryName(() => {
                return {
                    value: e.target.value.trim(),
                    validationMsgs: [],
                }
            });
        },
        []
    );
 
    const validateName = useCallback(
        function() {
            const validationMsgs: string[] = [];
            if (!categoryName.value) {
                validationMsgs.push('Required');
            }
            if (categoryName.value.length < 2 || categoryName.value.length > 75) {
                validationMsgs.push('Name length must be between 2 and 75 characters');
            }
            setCategoryName((prev) => {
                return {
                    ...prev,
                    validationMsgs,
                }
            });
        },
        [categoryName]
    );
    

    const descriptionHandler = useCallback(
        function(e: ChangeEvent<HTMLTextAreaElement>) {
            setDescription(() => {
                return {
                    value: e.target.value.trim(),
                    validationMsgs: [],
                }
            });
        },
        []
    );
    

    const validateDescription = useCallback(
        function validateDescription() {
            const validationMsgs: string[] = [];
            const maxLength = 1000;
            if (description.value.length > maxLength) {
                validationMsgs.push(`Maximum length - ${maxLength} characters`);
            }
            setDescription((prev) => {
                return {
                    ...prev,
                    validationMsgs
                }
            });
        },
        [description]
    );


    const showBrandsModal = useCallback(
        function() {
            setIsShowBrandsModal(true);
        },
        []
    );


    const hideBrandsModal = useCallback(
        function() {
            setIsShowBrandsModal(false);
        },
        []
    );
   

    const selectImage = useCallback(
        function(newFileList: FileList) {
            setImageFiles(newFileList);
        },
        []
    );
   
    const removeImage = useCallback(
        function removeImage(newFileList: FileList) {
            setImageFiles(newFileList);
        },
        []
    );


    const selectBrandHandler = useCallback(
        function(brand: DBBrand) {
            const prevBrands = [...categoryBrands];
            const duplicateBrandIdx = prevBrands.findIndex((item) => item._id === brand._id);
            if ( duplicateBrandIdx > -1 ) prevBrands.splice(duplicateBrandIdx, 1);
            else prevBrands.push(brand);

            setCategoryBrands(prevBrands);
        },
        [categoryBrands]
    );


    const clearSelectedBrands = useCallback(
        function() {
            setCategoryBrands([]);
        },
        []
    );
   
    
    const addPropertyBtn = useCallback(
        function() {
            const emtyProp: IUIProperty = {
                key: v4(),
                name: '',
                required: false,
                filterable: false,
                unit: '',
                inputSettings: {
                    inputType: 'String', 
                    isMultiselect: false,
                    isRange: false,
                },
                filterChoices: [],
                validationObj: {
                    name: ['Required'],
                },
            }
            setProperties((prev) => {
                return [
                    emtyProp,
                    ...prev,
                ]
            });
        },
        []
    );
    

    // Не помещай одну изменяющую стейт функцию в другую, иначе додобавится лишний рендер

    const statusHandler = useCallback(
        function(e: ChangeEvent<HTMLInputElement>) {
            const newStatus = e.target.value as CategoryStatusType;
            if ((originalStatus === 'root' || originalStatus === 'branch') && newStatus === 'leaf') {
                setStatusMessage('Are you sure? All subcategories and their properties will be deleted.');
            }
            else if (originalStatus === 'leaf' && (newStatus === 'root' || newStatus === 'branch')) {
                setStatusMessage('Are you sure? All properties will be deleted');
            }
            else {
                if (statusMessage) setStatusMessage('');
            }
            setStatus(newStatus)
        },
        [originalStatus, statusMessage]
    );
    

    const onChangeProperty = useCallback((chengedProperty: IUIProperty, propIndex: number) => { // в данном случае useCallback помогает не перерендеривать properties, когда меняется только category
        setProperties((prev) => {
            const props = [...prev];
            props[propIndex] = chengedProperty;
            return props;
        });
    }, []); // здесь не добавлено properties в массив зависимостей, чтобы эта функция не обновлялась при изменении properties. setProperties((prev) уже имеет доступ к актуальным properties. Так мы избавились от лишних перерендеров компоненты CategoryProperty.


    const onDeleteProperty = useCallback((propIndex: number) => {
        setProperties((prev) => {
            const props = [...prev];
            props.splice(propIndex, 1);
            return props;
        });
    }, []);


    const showModal = useCallback(
        function() {
            setIsShowCategoriesListModal(true);
        }, 
        []
    );
        

    const hideModal = useCallback(
        function hideModal() {
            setIsShowCategoriesListModal(false);
        }, 
        []
    );

        
    const chengeParent = useCallback(
        function(category: IUICategory) {
            setParentMessage('');
            setParent({_id: category._id, name: category.name});
            setIsShowCategoriesListModal(false);
        },
        []
    );
  

    const checkIsAllValid = useCallback(
        function checkIsAllValid() {
            const categoryIsValid = (categoryName.validationMsgs.length > 0 || description.validationMsgs.length > 0) ? false : true;
            let propsIsValid = true;
                    
            for (let i=0; i<properties.length; i+=1) {
                let result = true;
                if ( Object.keys(properties[i].validationObj).length > 0) {
                    result = false;
                    break;
                }
    
                properties[i].filterChoices?.forEach((item) => {
                    if (Object.keys(item.validationObj).length > 0) {
                        result = false;
                    }
                });
    
                propsIsValid = result;    
            }
            return (categoryIsValid && propsIsValid) ? true : false;
        },
        [categoryName.validationMsgs, description.validationMsgs, properties]
    );

    
    const createFormData = useCallback(
        function() {
            const props: PropertyType[] = properties.map((item) => {
                const prop: PropertyType = {
                    categoryId: categoryId,
                    _id: item._id,
                    name: item.name,
                    required: item.required,
                    filterable: item.filterable,
                    unit: item.unit,
                    inputSettings: item.inputSettings,
                }
    
                if (item.filterChoices && item.filterChoices.length > 0) {
                    prop.filterChoices = item.filterChoices.map((choice) => {
                        return {
                            name: choice.name,
                            value: choice.value,
                        }
                    })
                }
                return prop;
            });
    
            const category: IEditedCategory = {
                _id: categoryId,
                parentId: parent._id,
                name: categoryName.value,
                description: description.value,
                status: status!,
            }

            if (status === 'leaf') {
                category.brands = categoryBrands.map((brand) => brand._id);
            }   

            const formData = new FormData();
            formData.append('category', JSON.stringify(category));
            formData.append('props', JSON.stringify(props));
            if (imageFiles) {
                formData.append('files', imageFiles[0]);
            }
    
            return formData;
        },
        [categoryId, parent._id, categoryName.value, description.value, imageFiles, properties, status, categoryBrands]
    );
    
    
    async function submitHandler(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const isAllValid = checkIsAllValid();
        if (isAllValid) {
            try {
                const formData = createFormData();
                await CategoryServices.edit(categoryId, formData);
                dispatch(notificationActions.add({type: 'success', message: 'Category edited'}));
            }
            catch (err) {
                const e = err as AxiosError;
                const messages = (e.response!.data.message as string).split('|');
                for (let i=0; i<messages.length; i+=1) {
                    dispatch(notificationActions.add({type: 'error', message: messages[i]}));
                }
            }
        }
        else {
            console.log('not valid');
            dispatch(notificationActions.add({type: 'error', message: 'Not valid'}));
        }
    }



    // const filterChoices = useMemo(
    //     function() {
    //         const jsxElements: Array<JSX.Element> = [];

    //         for (let i=0; i<properties.length; i+=1) {
    //             if (properties[i].filterChoices) {
    //                 for (let j=0; j<properties[i].filterChoices!.length; j+=1) {
    //                     jsxElements.push(
    //                        <CategoryPropertyFilterChoice
    //                             key={properties[i].filterChoices![j].key}
    //                             choice={properties[i].filterChoices![j]}
    //                             choiceIndex={j}
    //                             propInputSettings={properties[i].inputSettings}
    //                             onChangeChoice={() => {}}
    //                             onDeleteChoice={() => {}}
    //                        />
    //                     )
                        
    //                 }
    //             }
    //         }

    //         return jsxElements;
    //     },
    //     [properties]
    // );

    

    return (
        isLoading ? 
        <Spinner/> :
        categoryId ?
            
        <div className="edit-category">
            <form onSubmit={submitHandler} className='edit-category__form'>
                
                <Card className='edit-category__status mb-2'>
                    <div className='edit-category__checkboxes'>
                        <CheckboxRadio type="radio" label="Root" name="categoryStatus" checked={status === 'root'} value='root' onChange={statusHandler}/>
                        <CheckboxRadio type="radio" label="Branch" name="categoryStatus" checked={status === 'branch'} value='branch' onChange={statusHandler}/>
                        <CheckboxRadio type="radio" label="Leaf" name="categoryStatus" checked={status === 'leaf'} value='leaf' onChange={statusHandler}/>
                    </div>
                    { statusMessage && <div className='edit-category__status-message'>{statusMessage}</div> }
                </Card> 

                {
                    status !== 'root' &&
                    <Card className='mb-2 edit-category__parent'>
                        <div className='edit-category__parent-name mb-2'>
                            <span className='edit-category__parent-title'>Parent Category:</span>
                            <span className='edit-category__parent-name mb-2'>{parent && parent.name ? parent.name : 'None'}</span>
                        </div>
                        <Button className='btn-secondary btn-sm mb-2' onClick={showModal}>Change</Button>
                        { parentMessage && <div className='edit-category__status-message'>{parentMessage}</div> }
                    </Card>
                }
                                
                <div className="mb-2">
                    <Input 
                        name='categoryName' 
                        value={categoryName.value} 
                        label='Name'
                        onChange={categoryNameHandler} 
                        onBlur={validateName}
                        messages={categoryName.validationMsgs}
                    />
                </div>
                        
                <div className="mb-2">
                    <TextArea 
                        name="descrition" 
                        onChange={descriptionHandler} 
                        onBlur={validateDescription}
                        value={description.value} 
                        label='Description' 
                        messages={description.validationMsgs}
                    />
                </div>

                <UploadImages  
                    name='categoryImage' 
                    label='Category Image'
                    imageFiles={imageFiles}
                    onChange={selectImage}
                    onRemove={removeImage}
                />

                {
                    status === 'leaf' ? 

                    <>
                         <div className="brands-box mb-2">
                            <MultiSelect 
                                idKey="_id"
                                labelKey="name"
                                title='Brands'
                                options={brands}
                                selectedOptions={categoryBrands}
                                onSelect={selectBrandHandler}
                                onUnselect={selectBrandHandler}
                                onClear={clearSelectedBrands}
                            />
                            <Button 
                                className="brands-btn btn-sm btn-secondary"
                                onClick={showBrandsModal}
                            >Brands</Button>
                        </div>

                        <div className="edit-properties mb-2">
                            <div className='d-flex mb-2'>
                                <Button className="btn-sm btn-secondary me-2" onClick={addPropertyBtn}>Add property</Button>
                            </div>
                            <div>
                                {
                                    properties.map((prop, index) => {
                                        return (
                                            <CategoryProperty 
                                                key={prop.key}
                                                property={prop} 
                                                // property={JSON.stringify(prop)} 
                                                propIndex={index}
                                                onChangeProperty={onChangeProperty}
                                                onDeleteProperty={onDeleteProperty}
                                            />
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </>
                     : 
                    ''
                }
                <Button type="submit" className="btn-sm btn-success">Submit</Button>
            </form>   
            {
                isShowCategoriesListModal  && 
                <CategoriesListModal 
                    hideModal={hideModal} 
                    checkbox={true} 
                    onCheck={chengeParent} 
                    currentCategoryId={categoryId}
                    checkedCategoryId={parent?._id}
                    statuses={['root', 'branch']}
                    multipleChecked={false}
                />
            }      

            {
                isShowBrandsModal ? 
                <BrandsModal
                    onBackdropClick={hideBrandsModal}
                /> : ''
            } 
        </div> :
        <div>Category not found</div>
    )
}

export default React.memo(EditCategory);