import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import  userSlice  from "./slices/userAuthentication"
import adminSlice from "./slices/adminAuthentication";
import tokenSlice from "./slices/userToken";
import AdmintokenSlice from "./slices/adminToken";


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