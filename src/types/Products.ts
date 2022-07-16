import IPaginatedData from "./response/IPaginatedData"
import { FilterChoiceType, IDBCategory, InputType } from "./CategoryTypes"
import {DBBrand} from './Brand';

export interface ICreateProductObj {
    name: string
    category: string
    description: string
    brand: string
    price: number
    warranty: number
    quantity?: number
    rating?: number
    properties: IProductProperty[]
}

export interface IEditedProductObj extends ICreateProductObj {
    _id: string
}

export type ProductPropValue = string | number | boolean | string[]
export interface IProductProperty {
    categoryPropId: string
    value: ProductPropValue
}

export interface IUIProductProperty extends IProductProperty {
    name: string
    filterable: boolean
    filterChoices?: FilterChoiceType[]
    type: InputType
    isMultiselect: boolean
    validationMessages: ProductPropValidationMessages
}

export interface IDBProduct {
    _id: string
    category: IDBCategory
    name: string
    description: string
    images: string[]
    // brand: string
    brand: DBBrand
    price: number
    warranty: number
    quantity?: number
    rating?: number
    properties: IProductProperty[]
    createdAt: string
    updatedAt: string
}

export interface IProductsData extends IPaginatedData<IDBProduct> {
    data: IDBProduct[]
}

export interface IProductValidationMessages {
    category?: string[]
    name?: string[]
    description?: string[]
    brand?: string[]
    price?: string[]
    warranty?: string[]
    quantity?: string[]
}
export type ProductPropValidationMessages = string[]