import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { api } from './services/api';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

setupListeners(store.dispatch);

export default store;