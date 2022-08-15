import IPaginatedData from "./response/IPaginatedData"
import { FilterChoice, FilterChoiceValue, IDBCategory, InputType, PropertyInputSettingsType } from "./CategoryTypes"
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
    properties: Array<IPreparedForUIProperty>
}

export interface IEditedProductObj extends ICreateProductObj {
    _id: string
}

// export type ProductPropValue = string | number | boolean | string[] | [number | null, number | null]
// type FilterChoiceValue = number | string | boolean | [number | undefined, number | undefined];
// export type ProductPropValue = string | number | boolean | Array<string>
export interface IProductProperty {
    _id?: string
    categoryPropId: string
    value: FilterChoiceValue
}

export interface IUIProductProperty extends IProductProperty {
    name: string
    filterable: boolean
    filterChoices?: FilterChoice[]
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
    brand: DBBrand
    price: number
    warranty: number
    quantity: number
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




export interface IPreparedForUIProperty {
    categoryPropId: string // если категория типа root или branch, то у неё нет пропсов, поэтому ts ругается, но при создании продукта мы можем выбрать только категорию типа leaf, у которой есть пропсы
    value: FilterChoiceValue
    name: string
    filterable: boolean
    filterChoices: Array<FilterChoice> | undefined
    unit?: string
    inputSettings: PropertyInputSettingsType
    validationMessages: Array<string>
}


export interface IPreparedForUIProduct {
    _id: string
    name: string
    description: string
    category: IDBCategory
    images: Array<string>
    brand: DBBrand
    price: number
    warranty: number
    quantity: number
    rating?: number
    properties: Array<IPreparedForUIProperty>
    createdAt: string
    updatedAt: string
    validationMessages: {
        category?: Array<string>
        name?: Array<string>
        description?: Array<string>
        brand?: Array<string>
        price?: Array<string>
        warranty?: Array<string>
        quantity?: Array<string>
    }
}