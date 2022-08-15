import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { IDBCategory, IUICategory } from '../../../types/CategoryTypes';
import {IProductProperty, IProductValidationMessages, IPreparedForUIProperty} from '../../../types/Products';
import {DBBrand} from '../../../types/Brand';

interface ICreateProductState {
    createProductIsLoading: boolean
    isValid: boolean
    isShowCategoryListModal: boolean
    product: {
        name: string
        category: IDBCategory
        description: string
        images?: FileList
        brand?: DBBrand
        price: number
        warranty: number
        quantity?: number
        rating?: number
        validationMessages: IProductValidationMessages
        properties: IPreparedForUIProperty[]
    }
}

const initialState: ICreateProductState = {
    createProductIsLoading: false,
    isValid: false,
    isShowCategoryListModal: false,
    product: {
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
        images: undefined,
        brand: undefined,
        price: 1,
        warranty: 1,
        quantity: 1,
        validationMessages: {},
        properties: [],
    },
}

const createProductSlice = createSlice({
    name: 'createProduct',
    initialState,
    reducers: {
        setCreateProductIsLoading(state, action:PayloadAction<boolean>) {
            state.createProductIsLoading = action.payload;
        },
        setIsShowCategoryListModal(state, action:PayloadAction<boolean>) {
            state.isShowCategoryListModal = action.payload;
        },
        getCategorySuccess(state, action:PayloadAction<IDBCategory>) {
            const category = action.payload;
            state.product.category = category;
            if (category.properties && category.properties.length > 0) {
                const props: Array<IPreparedForUIProperty> = [];
                for (let i=0; i<category.properties.length; i+=1) {
                    props.push({
                        categoryPropId: category.properties[i]._id!, // если категория типа root или branch, то у неё нет пропсов, поэтому ts ругается, но при создании продукта мы можем выбрать только категорию типа leaf, у которой есть пропсы
                        // value: '', // выбранный choice
                        value: category.properties[i].inputSettings.isMultiselect ? 
                            [] : 
                            category.properties[i].inputSettings.inputType === 'Boolean' ? 
                            false : '',
                        name: category.properties[i].name,
                        filterable: category.properties[i].filterable,
                        filterChoices: category.properties[i].filterChoices,
                        unit: category.properties[i].unit,
                        inputSettings: category.properties[i].inputSettings,
                        validationMessages: []
                    });
                }
                state.product.properties = props;
            }
        },
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
        setBrand(state, action: PayloadAction<DBBrand | undefined>) {
            const brand = action.payload;
            if (brand) state.product.brand = brand;
            else state.product.brand = undefined;
        },
        setImageFiles(state, action: PayloadAction<FileList>) {
            state.product.images = action.payload;
        },
        // setBrand(state, action: PayloadAction<string>) {
        //     state.product.validationMessages.brand = [];
        //     state.product.brand = action.payload;
        // },
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
        setPropValue(state, action: PayloadAction<IProductProperty>) {
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
                const category: string[] = []
                const name: string[] = [];
                const description: string[] = [];
                const brand: string[] = [];
                const price: string[] = [];
                const warranty: string[] = [];
                const quantity: string[] = [];
    
                if (!state.product.category._id) category.push('Category not selected');
                if (!state.product.name || state.product.name.length < 1 || state.product.name.length > 75) name.push('Name length must be 1 - 75 characters');
                if (!state.product.description || state.product.description.length < 1 || state.product.description.length > 500) description.push('Description length must be 1 - 500 characters');
                if (!state.product.brand) brand.push('Brand required');
                if (!state.product.price || state.product.price < 1 || state.product.price > 999999) price.push('Price must be between 1 - 999999');
                // if (state.product.price && state.product.price) priceMessages.push('Price must be between 1 - 999999'); 
                if (!state.product.warranty || state.product.warranty < 1 || state.product.warranty > 6) warranty.push('The warranty period should be from 1 - 6 years');
                if (!state.product.quantity || state.product.quantity < 1 || state.product.quantity > 9999) quantity.push('Quantity must be between 1 - 9999');
    
                state.product.validationMessages = {category, name, description, brand, price, warranty, quantity}
                if ( Object.values(state.product.validationMessages).flat().length > 0 ) prodIsValid = false;
            }

            function validateProperties() {
                const props = state.product.properties;
                for (let i=0; i<props.length; i+=1) {
                    props[i].validationMessages = [];
                    const messages: string[] = [];
                    if (props[i].inputSettings.inputType !== 'Boolean' && !props[i].value && props[i].value !== 0) messages.push('Required'); // Validation
                    props[i].validationMessages = messages;
                    if (messages.length > 0) propsIsValid = false;
                }
            }
        },
        cleanProductState(state) {
            state.product = initialState.product;
            // state = initialState; // Так не работает
        },
    }
});

export const createProductActions = createProductSlice.actions;
export default createProductSlice.reducer;