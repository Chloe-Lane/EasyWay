import { 
  ROOM_LIST_REQUEST, 
  ROOM_LIST_SUCCESS, 
  ROOM_LIST_FAIL,
  ROOM_DETAILS_REQUEST,
  ROOM_DETAILS_SUCCESS,
  ROOM_DETAILS_FAIL,
  ROOM_SEARCH_SUCCESS,
  ROOM_SEARCH_FAIL,
  ROOM_SEARCH_REQUEST,
  ROOM_CREATE_REQUEST,
  ROOM_CREATE_SUCCESS,
  ROOM_CREATE_FAIL,
  AMENITY_LIST_REQUEST,
  AMENITY_LIST_SUCCESS,
  AMENITY_LIST_FAIL,
  POLICY_LIST_REQUEST,
  POLICY_LIST_SUCCESS,
  POLICY_LIST_FAIL,
  ROOM_UPDATE_FAIL,
  ROOM_UPDATE_REQUEST,
  ROOM_UPDATE_SUCCESS,
} from '../constants/roomConstants';
import axios from 'axios'

export const listRooms = () => async (dispatch) => {

  try {
      dispatch({ type: ROOM_LIST_REQUEST })
      const {data} = await axios.get('/rooms')
      dispatch({
          type: ROOM_LIST_SUCCESS,
          payload: data
      });
  } catch (error) {
      dispatch({
          type: ROOM_LIST_FAIL,
          payload: error.response && error.response.data.message
              ? error.response.data.message
              : error.message,
      });

  }

}

export const listRoomDetails = (id) => async (dispatch) => {
  try {
      dispatch({ type: ROOM_DETAILS_REQUEST });

      const { data } = await axios.get(`/room/${id}`);  // ✅ Make sure endpoint is correct

      dispatch({
          type: ROOM_DETAILS_SUCCESS,
          payload: data
      });
  } catch (error) {
      dispatch({
          type: ROOM_DETAILS_FAIL,
          payload: error.response?.data.message || error.message
      });
  }
};

export const searchRooms = (query, selectedAmenities = []) => async (dispatch) => {
  try {
      dispatch({ type: ROOM_SEARCH_REQUEST });

      const params = new URLSearchParams();
      if (query) params.append("q", query);
      selectedAmenities.forEach((amenity) => params.append("amenities[]", amenity));

      const { data } = await axios.get(`/rooms/search/?${params.toString()}`);

      dispatch({ type: ROOM_SEARCH_SUCCESS, payload: data });
  } catch (error) {
      dispatch({
          type: ROOM_SEARCH_FAIL,
          payload: error.response && error.response.data.detail ? error.response.data.detail : error.message,
      });
  }
};
export const createRoom = (roomData) => async (dispatch, getState) => {
try {
  dispatch({ type: ROOM_CREATE_REQUEST });

  const {
    userLogin: { userInfo },
  } = getState();

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data', // Since there's an image
      Authorization: `Bearer ${userInfo.token}`,
    },
  };

  const { data } = await axios.post('/room/create/', roomData, config);

  dispatch({
    type: ROOM_CREATE_SUCCESS,
    payload: data,
  });
} catch (error) {
  dispatch({
    type: ROOM_CREATE_FAIL,
    payload:
      error.response && error.response.data.detail
        ? error.response.data.detail
        : error.message,
  });
}
};

export const listAmenities = () => async (dispatch) => {
  try {
    dispatch({ type: AMENITY_LIST_REQUEST });

    const { data } = await axios.get('/rooms/amenities/');

    dispatch({
      type: AMENITY_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: AMENITY_LIST_FAIL,
      payload: error.response?.data?.detail || error.message,
    });
  }
};

export const listPolicies = () => async (dispatch) => {
  try {
    dispatch({ type: POLICY_LIST_REQUEST });

    const { data } = await axios.get('/rooms/policies/');

    dispatch({
      type: POLICY_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: POLICY_LIST_FAIL,
      payload: error.response?.data?.detail || error.message,
    });
  }
};

export const updateRoom = (roomId, roomData) => async (dispatch, getState) => {
  try {
      dispatch({ type: ROOM_UPDATE_REQUEST });

      const { userLogin: { userInfo } } = getState();

      const config = {
          headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${userInfo.token}`,
          },
      };

      const formData = new FormData();

      for (const key in roomData) {
          if (Array.isArray(roomData[key])) {
              // Append array elements individually
              roomData[key].forEach((item) => {
                  formData.append(`${key}[]`, item);
              });
          } else if (roomData[key] !== null) {
              formData.append(key, roomData[key]);
          }
      }

      // Handle images separately (if applicable)
      if (roomData.images) {
          roomData.images.forEach((image) => formData.append('images', image));
      }

      const { data } = await axios.put(`/room/${roomId}/update/`, formData, config);

      dispatch({ type: ROOM_UPDATE_SUCCESS, payload: data });

  } catch (error) {
      let errorMessage = error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message;

      if (error.response && error.response.status === 403) {
          errorMessage = "You are not authorized to update this room.";
      }

      dispatch({ type: ROOM_UPDATE_FAIL, payload: errorMessage });
  }
};
