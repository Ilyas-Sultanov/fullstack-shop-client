export type InputType = 'Number' | 'String' | 'Boolean';
export type PropertyInputSettingsType = {inputType: InputType, isMultiselect: boolean, isRange: boolean};
export type CategoryStatusType = 'root' | 'branch' | 'leaf';
export type UnitsType = {
    _id: string
    name: string
}

export interface IDBCategory {
    _id: string
    name: string
    description: string
    status: CategoryStatusType
    img?: string
    parentId?: string
    properties?: PropertyType[]
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
    filterChoices?: FilterChoiceType[]
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

export type FilterChoiceValue = [number | null, number | null] | number | string

export type FilterChoiceType = {
    name: string
    value: FilterChoiceValue,
}

export interface IUIFilterChoice extends FilterChoiceType { 
    key: string
    validationObj: {
        name?: string[]
        value?: string[]
    }
}













// export type InputType = 'Number' | 'String' | 'Boolean';
// export type PropertyInputType = {inputType: InputType, isMultiselect: boolean};
// export type FilterChoicesTypeField = 'lt' | 'lte' | 'eq' | 'gte' | 'gt' | '';
// export type CategoryStatusType = 'root' | 'branch' | 'leaf';
// export type UnitsType = {
//     _id: string
//     name: string
// }

// export interface IDBCategory {
//     _id: string
//     name: string
//     description: string
//     status: CategoryStatusType
//     parentId?: string
//     properties?: PropertyType[]
// }

// export interface IResponseCategory extends IDBCategory {
//     parent?: {
//         _id: string
//         name: string
//     }
//     children: IResponseCategory[]
// }

// export interface IUICategory extends IDBCategory, IResponseCategory {
//     actionButtons?:  {label: JSX.Element, func: (categoryId: string) => void}[]
// }

// export interface INewCategory {
//     parentId?: string,
//     name: string,
//     description: string,
//     status: CategoryStatusType,
// }

// export interface IEditedCategory extends INewCategory {
//     _id: string
// }

// export type PropertyType = {
//     name: string
//     required: boolean
//     filterable: boolean
//     unit?: string
//     input: PropertyInputType
//     filterChoices?: FilterChoiceType[]
// }

// export interface IUIProperty extends PropertyType {
//     key: string
//     filterChoices?: IUIFilterChoice[]
//     validationObj: ValidationPropObjType
// }

// export type ValidationPropObjType = {
//     name?: string[]
//     unit?: string[]
//     filterable?: string[]
// }

// export type FilterChoiceType = {
//     name: string
//     value: string
//     type?: FilterChoicesTypeField
// }

// export interface IUIFilterChoice extends FilterChoiceType { 
//     key: string
//     validationObj: {
//         name?: string[]
//         value?: string[]
//         type?: string[]
//     }
// }
