import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isShow: false,
}

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        toggle(state, /* action */) { // action.payload
            state.isShow = !state.isShow;
        },
        show(state) {
            state.isShow = true;
        },
        hide(state) {
            state.isShow = false;
        },
    }
});

export const modalActions = modalSlice.actions;
export default modalSlice.reducer;