
import axios from 'axios';
import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGOUT,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FAIL,
    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS,
    USER_DETAILS_FAIL,
    USER_UPDATE_PROFILE_REQUEST,
    USER_UPDATE_PROFILE_SUCCESS,
    USER_UPDATE_PROFILE_FAIL,
    USER_SET_ROLE,
    USER_PROFILE_REQUEST,
    USER_PROFILE_SUCCESS,
    USER_PROFILE_FAIL,
} from '../constants/userConstants';

import { 
    SEARCH_ROOMS_REQUEST,
    SEARCH_ROOMS_SUCCESS,
    SEARCH_ROOMS_FAIL,
} from '../constants/roomConstants';

// ✅ LOGIN Action
export const login = (username, password) => async (dispatch) => {
    try {
        dispatch({ type: USER_LOGIN_REQUEST });

        const config = {
            headers: { 'Content-Type': 'application/json' }
        };

        const { data } = await axios.post(
            'https://easyway-backend-e605862abcad.herokuapp.com/users/login/',
            { username, password },
            config
        );

        dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
        localStorage.setItem('userInfo', JSON.stringify(data));

    } catch (error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: error.response?.data?.detail || error.message,
        });
    }
};
export const getUserProfile = () => async (dispatch, getState) => {
    try {
      dispatch({ type: USER_PROFILE_REQUEST });
  
      const {
        userLogin: { userInfo },
      } = getState();
  
      if (!userInfo || !userInfo.token) {
        // Handle token missing or invalid case
        dispatch({
          type: USER_PROFILE_FAIL,
          payload: 'Token is missing or invalid',
        });
        return;
      }
  
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
  
      const { data } = await axios.get('https://easyway-backend-e605862abcad.herokuapp.com/users/profile/', config);
  
      dispatch({
        type: USER_PROFILE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: USER_PROFILE_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  };

// ✅ REGISTER Action with accountType support
export const register = (username, email, password, role) => async (dispatch) => {
    try {
      dispatch({ type: USER_REGISTER_REQUEST });
  
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post('https://easyway-backend-e605862abcad.herokuapp.com/users/register', { username, email, password, role }, config);
  
      dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
  
      // Set the role in Redux after successful registration
      dispatch({ type: USER_SET_ROLE, payload: data.role });
  
      localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
      dispatch({
        type: USER_REGISTER_FAIL,
        payload:
          error.response && error.response.data.detail ? error.response.data.detail : error.message,
      });
    }
  };

// ✅ LOGOUT Action
export const logout = () => (dispatch) => {
    localStorage.removeItem('userInfo');
    dispatch({ type: USER_LOGOUT });
};

// ✅ SEARCH ROOMS Action
export const searchRooms = (query = '', amenities = []) => async (dispatch) => {
    try {
        dispatch({ type: SEARCH_ROOMS_REQUEST });

        const params = new URLSearchParams();
        if (query) params.append('q', query);
        amenities.forEach((amenity) => params.append('amenities[]', amenity)); // Include amenities

        const { data } = await axios.get(`https://easyway-backend-e605862abcad.herokuapp.com/rooms/search/?${params.toString()}`);

        dispatch({ type: SEARCH_ROOMS_SUCCESS, payload: data });

    } catch (error) {
        dispatch({
            type: SEARCH_ROOMS_FAIL,
            payload: error.response?.data?.message || error.message,
        });
    }
};

export const setUser = (userId) => (dispatch) => {
    dispatch({ type: 'USER_SET_ID', payload: userId });
};


export const getUserDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_DETAILS_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data } = await axios.get(`https://easyway-backend-e605862abcad.herokuapp.com/users/profile/`, config);
    dispatch({
      type: USER_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_DETAILS_FAIL,
      payload:
        error.response && error.response.data.details
          ? error.response.data.details
          : error.message,
    });
  }
};


export const updateUserProfile = (user) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_UPDATE_PROFILE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data } = await axios.put(`https://easyway-backend-e605862abcad.herokuapp.com/users/profile/update/`, user, config);
    dispatch({
      type: USER_UPDATE_PROFILE_SUCCESS,
      payload: data,
    });

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });
    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_UPDATE_PROFILE_FAIL,
      payload:
        error.response && error.response.data.details
          ? error.response.data.details
          : error.message,
    });
  }
};

