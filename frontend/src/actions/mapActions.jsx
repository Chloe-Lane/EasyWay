import {
    MAP_SET_LOCATION,
    MAP_SET_ERROR,
  } from '../constants/mapConstants';
  
  // Action to set map location
  export const setMapLocation = (latitude, longitude) => async (dispatch) => {
    try {
      dispatch({
        type: MAP_SET_LOCATION,
        payload: { latitude, longitude },
      });
    } catch (error) {
      dispatch(setMapError('Failed to load map')); // 🔹 Dispatch error if something goes wrong
    }
  };
  
  // Action to handle errors
  export const setMapError = (error) => ({
    type: MAP_SET_ERROR,
    payload: error,
  });
  