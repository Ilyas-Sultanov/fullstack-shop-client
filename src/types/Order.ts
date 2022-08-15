export type OrderItem = {
    productId: string
    quantity: number
    price: number // Цена на момент создания заказа
}

export interface INewOrder {
    userId: string
    items: Array<OrderItem>
    totalPrice: number
}

export interface IDBOrder extends INewOrder {
    _id: string
    createdAt: Date
    updatedAt: Date
}