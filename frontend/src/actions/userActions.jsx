import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGOUT,
} from '../constants/userConstants'
import { 
    SEARCH_ROOMS_REQUEST,
    SEARCH_ROOMS_SUCCESS,
    SEARCH_ROOMS_FAIL,
} from '../constants/roomConstants';

import axios from 'axios'

export const login = (username, password) => async (dispatch) => {
    try {
        dispatch({
            type: USER_LOGIN_REQUEST
        })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.post(
            '/users/login/',
            { 'username': username, 'password': password }
            , config
            )

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data,
        })

        localStorage.setItem('userInfo', JSON.stringify(data))

    } catch (error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: error.response && error.response.data.details
                ? error.response.data.details
                : error.message,
        })
    }
}

export const logout = () => (dispatch) => {
    localStorage.removeItem('userInfo')
    dispatch({type: USER_LOGOUT})
}

export const searchRooms = (query = '', amenities = []) => async (dispatch) => {
    try {
        dispatch({ type: SEARCH_ROOMS_REQUEST });

        const params = new URLSearchParams();
        if (query) params.append('q', query);
        amenities.forEach((amenity) => params.append('amenities[]', amenity)); // Include amenities

        const { data } = await axios.get(`/api/rooms/search/?${params.toString()}`);

        dispatch({
            type: SEARCH_ROOMS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: SEARCH_ROOMS_FAIL,
            payload: error.response?.data?.message || error.message,
        });
    }
};
