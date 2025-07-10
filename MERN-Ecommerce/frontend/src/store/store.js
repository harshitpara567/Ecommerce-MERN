import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../store/userSlice';
import cartReducer from '../store/cartSlice';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    user: userReducer,
    cart: cartReducer,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, 
        }),
});