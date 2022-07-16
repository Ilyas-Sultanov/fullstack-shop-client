import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type NoteType = 'success' | 'info' | 'error';

export  type NotificationType = {
    id: string,
    type: NoteType,
    message: string,
}

const initialState: NotificationType[] = [];

const notificationsSlice = createSlice({
    name:' notifications',
    initialState,
    reducers: {
        add(state, action: PayloadAction<{type: NoteType, message: string}>) {
            state.push({
                id: Date.now().toString(),
                type: action.payload.type,
                message: action.payload.message,
            })
        },
        remove(state, action: PayloadAction<string>) {
            const index = state.findIndex((note) => note.id === action.payload);
            state.splice(index, 1);
        }
    }
});

export const notificationActions = notificationsSlice.actions;
export default notificationsSlice.reducer;