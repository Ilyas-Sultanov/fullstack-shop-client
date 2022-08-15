import { DBBrand } from "./Brand";

export type InputType = 'Number' | 'String' | 'Boolean';
export type PropertyInputSettingsType = {inputType: InputType, isMultiselect: boolean, isRange: boolean};
export type CategoryStatusType = 'root' | 'branch' | 'leaf';

export interface IDBCategory {
    _id: string
    name: string
    description: string
    status: CategoryStatusType
    img?: string
    parentId?: string
    properties?: Array<PropertyType>
    brands: Array<DBBrand>
}

export interface IResponseCategory extends IDBCategory {
    parent?: {
        _id: string
        name: string
    }
    children: IResponseCategory[]
}

export interface IUICategory extends IResponseCategory {
    actionButtons?:  {label: JSX.Element, func: (categoryId: string) => void}[]
}

export interface INewCategory {
    parentId?: string,
    name: string,
    description: string,
    status: CategoryStatusType,
    brands?: Array<string>
}

export interface IEditedCategory extends INewCategory {
    _id: string
}

export type PropertyType = {
    categoryId?: string
    _id?: string
    name: string
    required: boolean
    filterable: boolean
    unit?: string
    inputSettings: PropertyInputSettingsType
    filterChoices?: FilterChoice[]
}

export interface IUIProperty extends PropertyType {
    key: string
    filterChoices?: IUIFilterChoice[]
    validationObj: ValidationPropObjType
}

export type ValidationPropObjType = {
    name?: string[]
    unit?: string[]
    filterable?: string[]
}

export type FilterChoiceValue = [number | null, number | null] | Array<string> | number | string | boolean
// export type FilterChoiceValue = number | string | boolean | Array<string>

export type FilterChoice = {
    name: string
    value: FilterChoiceValue,
}

export interface IUIFilterChoice extends FilterChoice { 
    key: string
    validationObj: {
        name?: string[]
        value?: string[]
    }
}