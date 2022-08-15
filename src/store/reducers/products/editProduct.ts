import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { DBBrand } from '../../../types/Brand';
import { FilterChoiceValue, IDBCategory, IUICategory } from '../../../types/CategoryTypes';
import { IProductProperty, IProductValidationMessages, IPreparedForUIProduct, IPreparedForUIProperty} from '../../../types/Products';

interface IEditProductState {
    editProductIsLoading: boolean
    isValid: boolean
    isEdited: boolean
    imageFiles: FileList      // FileList (файлы картинок полученные по url ссылкам)
    isShowCategoryListModal: boolean
    product: {
        _id: string
        name: string
        description: string
        category: IDBCategory
        images: string[]      // Массив url ссылок на файлы
        brand?: DBBrand // undefined когда во удаляем значение из инпута
        price: number
        warranty: number
        quantity?: number
        rating?: number
        // properties: IUIProductProperty[]
        properties: Array<IPreparedForUIProperty>
        createdAt: string
        updatedAt: string
        validationMessages: IProductValidationMessages
    }
}

const initialState: IEditProductState = {
    editProductIsLoading: false,
    isValid: false,
    isEdited: false,
    imageFiles: new DataTransfer().files,
    isShowCategoryListModal: false,
    product: {
        _id: '',
        name: '',
        category: {
            _id: '',
            name: '',
            description: '',
            status: 'leaf',
            parentId: '',
            properties: [],
            brands: [],
        },
        description: '',
        images: [],
        brand: {_id: '', name: ''},
        price: 1,
        warranty: 1,
        quantity: 1,
        validationMessages: {},
        properties: [],
        createdAt: '',
        updatedAt: '',
    },
}

const editProductSlice = createSlice({
    name: 'editProduct',
    initialState,
    reducers: {
        setProductIsLoading(state, action:PayloadAction<boolean>) {
            state.editProductIsLoading = action.payload;
        },
        getProductSuccess(state, action: PayloadAction<IPreparedForUIProduct>) {
            state.product = action.payload;
        },
        /**
         * Это преобразование решил сделать на сервере
         * т.к. эти данные в том-же виде нужны и для публичной страницы products,
         * и мне кажется логичнее когда на фронт уже приходят готовые данные.
         */
        // getProductSuccess(state, action: PayloadAction<IDBProduct>) {
        //     const product = action.payload;
        //     const category = action.payload.category;
    
        //     if (category.properties && category.properties.length > 0) {
        //         const props: IUIProductProperty[] = [];
        //         for (let i=0; i<category.properties.length; i+=1) {
        //             props.push({
        //                 categoryPropId: category.properties[i]._id!, // если категория типа root или branch, то у неё нет пропсов, поэтому ts ругается, но при создании продукта мы можем выбрать только категорию типа leaf, у которой есть пропсы
        //                 value: product.properties.find((prop) => prop.categoryPropId === category.properties![i]._id)!.value,
        //                 name: category.properties[i].name,
        //                 filterable: category.properties[i].filterable,
        //                 filterChoices: category.properties[i].filterChoices,
        //                 type: category.properties[i].inputSettings.inputType,
        //                 isMultiselect: category.properties[i].inputSettings.isMultiselect,
        //                 validationMessages: []
        //             });
        //         }
        //         state.product._id = product._id;
        //         state.product.name = product.name;
        //         state.product.category = product.category;
        //         state.product.brand = product.brand;
        //         state.product.description = product.description;
        //         state.product.images = product.images;
        //         state.product.price = product.price;
        //         state.product.quantity = product.quantity;
        //         state.product.warranty = product.warranty;
        //         state.product.properties = props;
        //     }
        // },
        setIsShowCategoryListModal(state, action:PayloadAction<boolean>) {
            state.isShowCategoryListModal = action.payload;
        },
        // getCategorySuccess(state, action:PayloadAction<IDBCategory>) { // категорию получаем когда изменяем уже имеющуюся категорию у товара
        //     const category = action.payload;
        //     state.product.category = category;
        //     if (category.properties && category.properties.length > 0) {
        //         const props: IUIProductProperty[] = [];
        //         for (let i=0; i<category.properties.length; i+=1) {
        //             props.push({
        //                 categoryPropId: category.properties[i]._id!, // если категория типа root или branch, то у неё нет пропсов, поэтому ts ругается, но при создании продукта мы можем выбрать только категорию типа leaf, у которой есть пропсы
        //                 value: category.properties[i].inputSettings.isMultiselect ? // выбранный choice (у новой категории нет значений для choice, поэтому все значения пустые или false)
        //                     [] : 
        //                     category.properties[i].inputSettings.inputType === 'Boolean' ? 
        //                     false : '',
        //                 name: category.properties[i].name,
        //                 filterable: category.properties[i].filterable,
        //                 filterChoices: category.properties[i].filterChoices,
        //                 type: category.properties[i].inputSettings.inputType,
        //                 isMultiselect: category.properties[i].inputSettings.isMultiselect,
        //                 validationMessages: []
        //             });
        //         }
        //         state.product.properties = props;
        //     }
        // },
        setCategory(state, action: PayloadAction<IUICategory>) {
            state.product.category = action.payload;
        },
        setName(state, action: PayloadAction<string>) {
            state.product.validationMessages.name = [];
            state.product.name = action.payload;
        },
        setDescription(state, action: PayloadAction<string>) {
            state.product.validationMessages.description = [];
            state.product.description = action.payload;
        },
        setImageFiles(state, action: PayloadAction<FileList>) {
            state.imageFiles = action.payload;
        },
        removeImage(state, action: PayloadAction<FileList>) {
            /**
             * Когда изображение удалено из FileList (сюда FileList приходит уже с удалённым файлом изображения),
             * заменяем state.imageFiles на пришедший FileList, далее нужно удалить url удалённого изображения из state.product.images.
             * Если удаляется изображение которого небыло на сервере (т.е. удалили изображение которое не сохраняли на сервер), 
             * а значит и url не существует и удалять его не надо.
             */
            const newFileList = action.payload;
            const fileNames: string[] = Array.from(newFileList).map((file) => file.name);

            let newUrls = state.product.images;
            for (let i=0; i<state.product.images.length; i+=1) {
                const idx = state.product.images[i].lastIndexOf('/') + 1;
                const nameFromUrl = state.product.images[i].slice(idx);
                if (!fileNames.includes(nameFromUrl)) {
                    newUrls = newUrls.filter((url) => url !== state.product.images[i]);
                }
            }
            state.imageFiles = newFileList;
            state.product.images = newUrls;
        },
        setBrand(state, action: PayloadAction<DBBrand | undefined>) {
            const brand = action.payload;
            if (brand) state.product.brand = brand;
            else state.product.brand = undefined;
        },
        setPrice(state, action: PayloadAction<string>) {
            state.product.validationMessages.price = [];
            state.product.price = +action.payload;
        },
        setWarranty(state, action: PayloadAction<string>) {
            state.product.validationMessages.warranty = [];
            state.product.warranty = +action.payload;
        },
        setQuantity(state, action: PayloadAction<string>) {
            state.product.validationMessages.quantity = [];
            state.product.quantity = +action.payload;
        },
        setPropValue(state, action: PayloadAction<{categoryPropId: string, value: FilterChoiceValue}>) {
            const targetProp = state.product.properties.find((prop) => prop.categoryPropId === action.payload.categoryPropId);
            if (targetProp) {
                targetProp.validationMessages = [];
                targetProp.value = action.payload.value;
            }
        },
        setMultiselectPropValue(state, action: PayloadAction<IProductProperty>) {
            const targetProp = state.product.properties.find((prop) => prop.categoryPropId === action.payload.categoryPropId);
            if (targetProp) {
                targetProp.validationMessages = [];
                const oldValue = [...targetProp.value as string[]];
                const newEl = action.payload.value as string;
                const isIncludes = oldValue.includes(newEl);
                if (isIncludes) {
                    targetProp.value = oldValue.filter((item) => item !== newEl);
                }
                else {
                    targetProp.value = [...oldValue, newEl];
                }
            }
        },
        setIsvalid(state, action: PayloadAction<boolean>) {
            state.isValid = action.payload;
        },
        validate(state) {
            let prodIsValid = true;
            let propsIsValid = true;
            validateProduct();
            validateProperties();           

            if (prodIsValid && propsIsValid) {
                state.isValid = true;
            }
            
            function validateProduct() {
                state.product.validationMessages = initialState.product.validationMessages;
                const name: string[] = [];
                const description: string[] = [];
                const brand: string[] = [];
                const price: string[] = [];
                const warranty: string[] = [];
                const quantity: string[] = [];
    
                if (!state.product.name || state.product.name.length < 1 || state.product.name.length > 75) name.push('Name length must be 1 - 75 characters');
                if (!state.product.description || state.product.description.length < 1 || state.product.description.length > 500) description.push('Description length must be 1 - 500 characters');
                if (!state.product.brand) brand.push('Brand required');
                if (!state.product.price || state.product.price < 1 || state.product.price > 999999) price.push('Price must be between 1 - 999999');
                // if (state.product.price && state.product.price) priceMessages.push('Price must be between 1 - 999999'); 
                if (!state.product.warranty || state.product.warranty < 1 || state.product.warranty > 6) warranty.push('The warranty period should be from 1 - 6 years');
                if (!state.product.quantity || state.product.quantity < 1 || state.product.quantity > 9999) quantity.push('Quantity must be between 1 - 9999');
    
                state.product.validationMessages = {name, description, brand, price, warranty, quantity}
                if ( Object.values(state.product.validationMessages).flat().length > 0 ) prodIsValid = false;
            }

            function validateProperties() {
                const props = state.product.properties;
                for (let i=0; i<props.length; i+=1) {
                    const messages: string[] = [];
                    if (props[i].inputSettings.inputType !== 'Boolean' && !props[i].value && props[i].value !== 0) messages.push('Required');
                    props[i].validationMessages = messages;
                    if (messages.length > 0) propsIsValid = false;
                }
            }
        },
        editProductSuccess(state) {
            state.isValid = false;
        },
        cleanEditProductState(state) {
            state.product = initialState.product;
            state.imageFiles = new DataTransfer().files;
        },
    }
});

export const editProductActions = editProductSlice.actions;
export default editProductSlice.reducer;