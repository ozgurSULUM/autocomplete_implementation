import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import reducers from "./reducers";
import apiMiddleware from "./apis/middleware";

const store = configureStore(
    {
        reducer: reducers,
        devTools: import.meta.env.REDUX_DEV_TOOLS,
        middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiMiddleware),
    }
);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


export default store;
