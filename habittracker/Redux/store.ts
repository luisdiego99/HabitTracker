import { configureStore } from "@reduxjs/toolkit";
import habitReducer from "../features/habit/habitSlice";

export const makeStore = () => {
    return configureStore({
        reducer: {
            habits: habitReducer
        },
    });
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];