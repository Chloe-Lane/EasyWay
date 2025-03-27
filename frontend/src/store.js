import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {thunk} from 'redux-thunk';
import { amenityListReducer, policyListReducer, roomCreateReducer, roomDetailsReducer, roomsListReducer, roomUpdateReducer } from './reducers/roomsReducers';
import { userDetailsReducer, userLoginReducer, userProfileReducer, userRegisterReducer, userUpdateProfileReducer } from './reducers/userReducers';
import { searchRoomsReducer } from './reducers/roomsReducers';
import { mapReducer } from './reducers/mapReducers';
import { chatReducer } from './reducers/ChatReducers'
import { bookingCreateReducer, bookingPayReducer, bookingReducer, bookingDetailsReducer } from './reducers/bookingReducers';
import { bookingListMyReducer } from "./reducers/bookingReducers";


const reducer = combineReducers({
    roomsList: roomsListReducer,
    roomDetails: roomDetailsReducer,
    userLogin: userLoginReducer,
    searchRooms: searchRoomsReducer,
    map: mapReducer,
    userRegister: userRegisterReducer,
    roomCreate: roomCreateReducer,
    amenityList: amenityListReducer,
    policyList: policyListReducer,
    roomUpdate: roomUpdateReducer,
    chat: chatReducer,
    userProfile: userProfileReducer,
    roomList: roomsListReducer,
    userUpdateProfile: userUpdateProfileReducer,
    bookingListMy: bookingListMyReducer,
    userDetails: userDetailsReducer,
    booking: bookingReducer,
    bookingPay: bookingPayReducer,
    bookingCreate: bookingCreateReducer,
    bookingDetails: bookingDetailsReducer,
})

const userInfoFromStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null

const initialState = {
    userLogin: {userInfo: userInfoFromStorage},
    }

const store = configureStore({
    reducer: reducer,
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),

});


export default store;