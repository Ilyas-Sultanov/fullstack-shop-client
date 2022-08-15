import { ChangeEvent, FormEvent, useState, useCallback, memo, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from "../../../components/UI/Button/Button";
import Input from "../../../components/UI/Input/Input";
import TextArea from "../../../components/UI/TextArea/TextArea";
import CheckboxRadio from "../../../components/UI/Checkbox-Radio/CheckboxRadio";
import UploadImages from '../../../components/UploadImages/UploadImages';
import MultiSelect from "../../../components/UI/MultiSelect/MultiSelect";
import BrandsModal from "./brandsModal";
import CategoryProperty from './CategoryProperty';
import {PropertyType, IUIProperty, CategoryStatusType, INewCategory } from "../../../types/CategoryTypes";
import { AxiosError } from 'axios';
import { notificationActions } from '../../../store/reducers/notifications';
import CategoryServices from '../../../services/CategoryServices';
import {v4} from 'uuid';
import { getBrands } from '../../../store/reducers/brands/brandsActionCreators';
import { RootState } from "../../../store/store";
import { DBBrand } from "../../../types/Brand";

function CreateCategory() {
    const dispatch =  useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [categoryName, setCategoryName] = useState<{value: string, validationMsgs: string[]}>({value: '', validationMsgs: []});
    const [description, setDescription] = useState<{value: string, validationMsgs: string[]}>({value: '', validationMsgs: []});
    const [categoryStatus, setCategoryStatus] = useState<CategoryStatusType>(location.state ? 'branch' : 'root'); // в location.state находится _id родительской категории
    const [properties, setProperties] = useState<IUIProperty[]>([]);
    const [imageFiles, setImageFiles] = useState<FileList | undefined>();
    const [categoryBrands, setCategoryBrands] = useState<Array<DBBrand>>([]);
    const {brands} = useSelector((state: RootState) => state.brands);
    const [isShowBrandsModal, setIsShowBrandsModal] = useState(false);

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
        [categoryName.value]
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
        function() {
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
        [description.value]
    );
    

    const statusHandler = useCallback(
        function(e: ChangeEvent<HTMLInputElement>) {
            setCategoryStatus(e.target.value as CategoryStatusType);
        },
        []
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
            const prev = [...categoryBrands];
            const duplicateIdx = prev.findIndex((item) => item._id === brand._id);
            if ( duplicateIdx > -1 ) {
                prev.splice(duplicateIdx, 1);
            }
            else {
                prev.push(brand);
            }
            setCategoryBrands(prev);
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
        function addPropertyBtn() {
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


    const checkIsAllValid = useCallback(
        function() {
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
        function createFormData() {
            const props: PropertyType[] = properties.map((item) => {
                const prop: PropertyType = {
                    name: item.name,
                    required: item.required,
                    filterable: item.filterable,
                    unit: item.unit,
                    inputSettings: item.inputSettings,
                }
    
                if (item.inputSettings.inputType !== 'Boolean' && item.filterChoices && item.filterChoices.length > 0) {
                    prop.filterChoices = item.filterChoices.map((choice) => {
                        return {
                            name: choice.name,
                            value: choice.value,
                        }
                    })
                }
                return prop;
            });
    
            const category: INewCategory = {
                parentId: location.state ? location.state as string : '',
                name: categoryName.value,
                description: description.value,
                status: categoryStatus,
            }

            if (categoryStatus === 'leaf') {
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
        [location.state, categoryName.value, description.value, imageFiles, properties, categoryStatus, categoryBrands]
    );
    

    
    async function submitHandler(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const isAllValid = checkIsAllValid();

        if (isAllValid) {
            try {
                const formData = createFormData();
                await CategoryServices.create(formData);
                navigate('/admin/categories');
                dispatch(notificationActions.add({type: 'success', message: 'Category created'}));
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
    
    
    return (
        <div className="create-category">
            <form onSubmit={submitHandler} className='create-category__form'>
                {
                    location.state ? 
                    <div className='create-category__checkboxes'>
                        <CheckboxRadio type="radio" label="Branch" name="categoryStatus" checked={categoryStatus === 'branch'} value='branch' onChange={statusHandler}/>
                        <CheckboxRadio type="radio" label="Leaf" name="categoryStatus" checked={categoryStatus === 'leaf'} value='leaf' onChange={statusHandler}/>
                    </div> : ''
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
                    categoryStatus === 'leaf' ? 
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

                        <div className="create-properties mb-2">
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
                isShowBrandsModal ? 
                <BrandsModal
                    onBackdropClick={hideBrandsModal}
                /> : ''
            } 
        </div>
    )
}

export default memo(CreateCategory);