import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import  userSlice  from "./slices/UserAuthentication"
import adminSlice from "./slices/AdminAuthentication";
import tokenSlice from "./slices/UserToken";
import AdmintokenSlice from "./slices/AdminToken";


const persistConfig = {
    key: "root",
    storage,
};


const rootReducer = combineReducers({
    userAuth: userSlice,
    adminAuth: adminSlice,
    userToken: tokenSlice,
    adminToken: AdmintokenSlice,
});

export default persistReducer(persistConfig, rootReducer);