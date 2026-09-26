import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import dashboardReducer from "./features/dashboard/dashbaordSlice";
import { templateApi } from "./features/template/templateAPI";
import templateUIReducer from "./features/template/templateSlice";
import { certificateApi } from "./features/certificate/certificateAPI";
import certificateUIReducer from "./features/certificate/certificateSlice";
import { verificationApi } from "./features/verification/verificationAPI";
import verificationUIReducer from "./features/verification/verificationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    templateUI: templateUIReducer,
    [templateApi.reducerPath]: templateApi.reducer,
    certificateUI: certificateUIReducer,
    [certificateApi.reducerPath]: certificateApi.reducer,
    verificationUI: verificationUIReducer,
    [verificationApi.reducerPath]: verificationApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      templateApi.middleware,
      certificateApi.middleware,
      verificationApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
