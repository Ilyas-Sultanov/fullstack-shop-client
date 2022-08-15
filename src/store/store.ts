import { configureStore } from "@reduxjs/toolkit";
import modalReducer from './reducers/modal';
import notificationsReducer from './reducers/notifications';
import authReducer from './reducers/auth/auth';
import usersReduser from './reducers/users/users';
import rolesReduser from './reducers/roles/roles';
import categoriesReducer from './reducers/categories/categories';
import productsTableReduser from './reducers/products/productsTable'; // products для админа
import productsReduser from './reducers/products/products'; // публичный products
import createProductReducer from './reducers/products/createProduct';
import editProductReducer from './reducers/products/editProduct';
import brandsReducer from './reducers/brands/brands';
import categoriesMenuReducer from "./reducers/categoriesMenu/categoriesMenu";
import shoppingCartReducer from './reducers/shoppingCart/shoppingCart';
import productReducer from './reducers/product/product';

const store = configureStore({
    reducer: {
        modal: modalReducer,
        notifications: notificationsReducer,
        auth: authReducer,
        users: usersReduser,
        roles: rolesReduser,
        categories: categoriesReducer,
        productsTable: productsTableReduser,
        products: productsReduser,
        createProduct: createProductReducer,
        editProduct: editProductReducer,
        brands: brandsReducer,
        categoriesMenu: categoriesMenuReducer,
        shoppingCart: shoppingCartReducer,
        product: productReducer,
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: ['createProduct/setImageFiles', 'editProduct/setImageFiles', 'editProduct/removeImage'],
            ignoredPaths: ['createProduct.product.images', 'editProduct.imageFiles'],
            /**
             * здесь пришлось изменить стандартное поведение serializableCheck middleware,
             * он проверяет все данные перед записью в стейт и т.к. по умолчанию 
             * при записи в стейт non-serializable value, возникает предупреждение
             * A non-serializable value was detected in an action, in the path: `payload`. Value: ...
             * В моём случае я записываю в стейт значение типа FileList и оно является non-serializable value.
             * Опция ignoredActions: ['createProduct/setImageFiles'] позволяет отключать проверку для конкретного action createProduct/setImageFiles
             * Можно было полностью отключить serializableCheck middleware, вот так: serializableCheck: false.
             * 
             * PS: Serializable means it can be written down as text and converted back to original object without losing information.
             */

            // https://redux-toolkit.js.org/usage/usage-guide#working-with-non-serializable-data
            // Ignore these action types
            // ignoredActions: ['your/action/type'],
            // Ignore these field paths in all actions
            // ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
            // Ignore these paths in the state
            // ignoredPaths: ['items.dates'],
        },
    }),
});

export type RootState = ReturnType<typeof store.getState> // получение типа нашего стейта
export type AppDispatch = typeof store.dispatch; // получение типа диспатча
export default store;