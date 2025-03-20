import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {thunk} from 'redux-thunk';
import { roomDetailsReducer, roomsListReducer } from './reducers/roomsReducers';
import { userLoginReducer } from './reducers/userReducers';
import { searchRoomsReducer } from './reducers/roomsReducers';
import { mapReducer } from './reducers/mapReducers';



const reducer = combineReducers({
    roomsList: roomsListReducer,
    roomDetails: roomDetailsReducer,
    userLogin: userLoginReducer,
    searchRooms: searchRoomsReducer,
    map: mapReducer,
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

