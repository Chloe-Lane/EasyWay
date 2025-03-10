import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {thunk} from 'redux-thunk';
import { roomDetailsReducer, roomsListReducer } from './reducers/roomsReducers';

const reducer = combineReducers({
    roomsList: roomsListReducer,
    roomDetails: roomDetailsReducer,
})

const initialState = {

}

const middleware = [thunk]

const store = configureStore({
    reducer,
    initialState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middleware),
})

export default store