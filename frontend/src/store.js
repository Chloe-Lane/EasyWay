import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {thunk} from 'redux-thunk';
import { roomDetailsReducer, roomsListReducer } from './reducers/roomsReducers';
import { userLoginReducer } from './reducers/userReducers';



const reducer = combineReducers({
    roomsList: roomsListReducer,
    roomDetails: roomDetailsReducer,
    userLogin: userLoginReducer,
})

const userInfoFromStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null

const initialState = {
    userLogin: {userInfo: userInfoFromStorage},
}

const store = configureStore({
    reducer,
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
})

export default store;