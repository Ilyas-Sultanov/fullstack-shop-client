import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IUsersData from '../../../types/response/IUsersData';

export interface IEditUserValidationMessages extends Record<string, string | string[] | undefined> {
    name?: string[]
    email?: string[]
    password?: string[]
    roles?: string
}

export interface IEditingUser extends Record<string, string | undefined | string[] | boolean | IEditUserValidationMessages> {
    _id: string
    name: string
    email: string
    password?: string
    roles: string[];
    isActivated: boolean
    createdAt: string
    updatedAt: string
}

interface IUsersState {
    isShowEditUserModal: boolean
    usersIsLoading: boolean
    isRedownloadUsers: boolean
    error: string
    activeUserId: string
    isActivatedOptions: Array<{label: string, value: string}>
    usersData: IUsersData
    editingUser: IEditingUser
    editUserValidationMessages: IEditUserValidationMessages
}

const initialState: IUsersState = {
    isShowEditUserModal: false,
    usersIsLoading: false,
    isRedownloadUsers: false,
    error: '',
    activeUserId: '',
    isActivatedOptions: [
        {label: 'Activated', value: 'true'},
        {label: 'Not activated', value: 'false'}
    ],
    usersData: {
        totalNumberOfMatches: 0,
        currentPage: 1,
        limit: 10,
        link: '',
        data: [],
    },
    editingUser: {
        _id: '',
        name: '',
        email: '',
        password: '',
        roles: [],
        isActivated: false,
        createdAt: '',
        updatedAt: '',
    },
    editUserValidationMessages: {
        name: [],
        email: [],
        password: [],
        roles: '',
    }
}

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setIsShowEditUserModal(state, action: PayloadAction<boolean>) {
            state.isShowEditUserModal = action.payload;
            if (action.payload === false) {
                state.editingUser = initialState.editingUser;
                state.activeUserId = '';
            }
        },
        setIsLoading(state, action:PayloadAction<boolean>) {
            state.usersIsLoading = action.payload;
            if (state.error) {
                state.error = '';
            }
        },
        setError(state, action: PayloadAction<string>) {
            state.error = action.payload;
        },
        setActiveUserId(state, action: PayloadAction<string>) { // _id удаляемого или редактируемого пользователя
            state.activeUserId = action.payload;
        },
        getSuccess(state, action: PayloadAction<IUsersData>) {
            state.error = '';
            state.usersData = action.payload;
            if (state.isRedownloadUsers === true) {
                state.isRedownloadUsers = false;
            }
        },
        setEditingUser(state, action: PayloadAction<IEditingUser | null>) {
            if (action.payload === null) {
                state.editingUser = initialState.editingUser;
            }
            else {
                state.editingUser = action.payload;
            }
        },
        updateEditingUser(state, action: PayloadAction<Record<string, string | string[] | boolean>>) {
            const key = Object.keys(action.payload)[0];
            const value = Object.values(action.payload)[0];
            state.editingUser[key] = value;
        },
        editSuccess(state) {
            state.editingUser = initialState.editingUser;
            state.activeUserId = '';
            state.isShowEditUserModal = false;
            state.isRedownloadUsers = true;
        },
        deleteSuccess(state, action: PayloadAction<string>) {
            const index = state.usersData.data.findIndex((user) => user._id === action.payload); // findIndex
            state.usersData.data.splice(index, 1);
            state.error = '';
            state.activeUserId = '';
        },       
        setEditValidationMessages(state, action: PayloadAction<IEditUserValidationMessages>) {
            const key = Object.keys(action.payload)[0];
            const value = action.payload[key];
            state.editUserValidationMessages[key] = value;
        },
        clearEditValidationMessages(state) {
            state.editUserValidationMessages = initialState.editUserValidationMessages;
        }
    }
});

export const usersActions = usersSlice.actions;
export default usersSlice.reducer;