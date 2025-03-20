import { ROOM_LIST_REQUEST, ROOM_LIST_SUCCESS, ROOM_LIST_FAIL,
    ROOM_DETAILS_REQUEST, ROOM_DETAILS_SUCCESS, ROOM_DETAILS_FAIL,
    SEARCH_ROOMS_SUCCESS, SEARCH_ROOMS_FAIL
} from '../constants/roomConstants'
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

        const { data } = await axios.get(`/rooms/${id}`);  // ✅ Make sure endpoint is correct

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

export const searchRooms = (query) => async (dispatch) => {
    try {
        const { data } = await axios.get(`/rooms/search/?q=${query}`);

        dispatch({
            type: SEARCH_ROOMS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: SEARCH_ROOMS_FAIL,
        });
    }
};