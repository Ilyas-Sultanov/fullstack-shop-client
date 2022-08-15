import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ShoppingCartItem = {
    productId: string
    name: string
    img: string
    price: number
    quantity: number
    count: number
}

export interface INewShoppingCart {
    shoppingCartItems: Array<ShoppingCartItem>
    totalCount: number
    totalPrice: number
}

export interface IDBShoppingCart extends INewShoppingCart {
    userId: string
    createdAt: Date
    updatedAt: Date
}

export interface IShoppingCartState {
    shoppingCartIsLoading: boolean
    isShowCart: boolean
}

// Проверяем наличие данных в LocalStorage
const cartStr = localStorage.getItem('shoppingCart');
const cart: IShoppingCartState & INewShoppingCart = cartStr ? JSON.parse(cartStr) : null;

const initialState: IShoppingCartState & INewShoppingCart = cart ? cart : {
    shoppingCartIsLoading: false,
    isShowCart: false,
    shoppingCartItems: [],
    totalCount: 0,
    totalPrice: 0,
}

function calculateTotals(items: Array<ShoppingCartItem>) {
    let count = 0;
    let price = 0;
    for (let i=0; i<items.length; i+=1) {
        count = count + items[i].count;
        price = price + (items[i].price * items[i].count);
    }
    return {count, price};
}

const shoppingCartSlice = createSlice({
    name: 'shoppingCart',
    initialState,
    reducers: {
        setShoppingCartIsLoading(state, action: PayloadAction<boolean>) {
            state.shoppingCartIsLoading = action.payload;
        },
        setIsShowShoppingCart(state, action: PayloadAction<boolean>) {
            state.isShowCart = action.payload;
        },
        addItem(state, action: PayloadAction<ShoppingCartItem>) {
            state.shoppingCartItems.push(action.payload);
            const {count, price} = calculateTotals(state.shoppingCartItems);
            state.totalCount = count;
            state.totalPrice = price;
        },
        changeCount(state, action: PayloadAction<{productId: string, count: number}>) {
            for (let i=0; i<state.shoppingCartItems.length; i+=1) {
                if (state.shoppingCartItems[i].productId === action.payload.productId) {
                    state.shoppingCartItems[i].count = action.payload.count;
                    const {count, price} = calculateTotals(state.shoppingCartItems);
                    state.totalCount = count;
                    state.totalPrice = price;
                    if (state.shoppingCartItems.length === 0) {
                        state.isShowCart = false;
                    }
                    break;
                }
            }
        },
        increaseCount(state, action: PayloadAction<string>) {
            let targetIdx: number | null = null;
            const targetItem = state.shoppingCartItems.find((item, index) => {
                if (item.productId === action.payload) {
                    targetIdx = index;
                    return item;
                }
                return undefined;
            });
            
            if (targetItem && (targetIdx || targetIdx === 0)) {
                state.shoppingCartItems.splice(targetIdx, 1, {...targetItem, count: targetItem.count+1});
                const {count, price} = calculateTotals(state.shoppingCartItems);
                state.totalCount = count;
                state.totalPrice = price;
            }
        },
        decreaseCount(state, action: PayloadAction<string>) {
            let targetIdx: number | null = null;
            const targetItem = state.shoppingCartItems.find((item, index) => {
                if (item.productId === action.payload) {
                    targetIdx = index;
                    return item;
                }
                return undefined;
            });
            
            if (targetItem && (targetIdx || targetIdx === 0)) {
                if (targetItem.count === 1) {
                    state.shoppingCartItems.splice(targetIdx, 1);
                }
                else {
                    state.shoppingCartItems.splice(targetIdx, 1, {...targetItem, count: targetItem.count-1});
                }
                if (state.shoppingCartItems.length === 0) {
                    state.isShowCart = false;
                }
                const {count, price} = calculateTotals(state.shoppingCartItems);
                state.totalCount = count;
                state.totalPrice = price;
                if (state.shoppingCartItems.length === 0) {
                    state.isShowCart = false;
                }
            }
        },
        removeOne(state, action: PayloadAction<string>) {
            const productId = action.payload;
            state.shoppingCartItems = state.shoppingCartItems.filter((item) => {
                return item.productId !== productId;
            });
            const {count, price} = calculateTotals(state.shoppingCartItems);
            state.totalCount = count;
            state.totalPrice = price;
            if (state.shoppingCartItems.length === 0) {
                state.isShowCart = false;
            }
        },
        removeMany(state, action: PayloadAction<string>) {
            state.shoppingCartItems = state.shoppingCartItems.filter((item) => item.productId !== action.payload);
            const {count, price} = calculateTotals(state.shoppingCartItems);
            state.totalCount = count;
            state.totalPrice = price;
            if (state.shoppingCartItems.length === 0) {
                state.isShowCart = false;
            }
        },
        removeAll(state) {
            state.isShowCart = false;
            state.shoppingCartItems = [];
            state.totalCount = 0;
        },
    }
});

export const shoppingCartActions = shoppingCartSlice.actions;
export default shoppingCartSlice.reducer;