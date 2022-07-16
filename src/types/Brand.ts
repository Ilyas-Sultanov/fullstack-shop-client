export type DBBrand = {
    _id: string
    name: string
}

export interface IUIbrand extends DBBrand {
    value: string,
    selected: boolean
}

export type BrandActionType = 'create' | 'edit'