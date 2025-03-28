import { 
  BOOKING_LIST_MY_REQUEST, 
  BOOKING_LIST_MY_SUCCESS, 
  BOOKING_LIST_MY_FAIL, 
  BOOKING_PAY_FAIL,
  BOOKING_PAY_REQUEST,
  BOOKING_PAY_SUCCESS,
  BOOKING_CREATE_REQUEST,
  BOOKING_CREATE_SUCCESS,
  BOOKING_CREATE_FAIL,
} from "../constants/bookingConstants";

import axios from "axios";

const storedDates = JSON.parse(localStorage.getItem("bookingDates")) || {};

const initialState = {
  bookingDates: {
    startDate: storedDates.startDate ? new Date(storedDates.startDate) : null,
    endDate: storedDates.endDate ? new Date(storedDates.endDate) : null,
  },
};



export const saveBookingDates = (dates) => (dispatch) => {
  const serializedDates = {
    startDate: dates.startDate ? new Date(dates.startDate).toDateString() : null,
    endDate: dates.endDate ? new Date(dates.endDate).toDateString() : null,
  };

  dispatch({
    type: "SAVE_BOOKING_DATES",
    payload: serializedDates,
  });

  // Save in localStorage for persistence (without UTC conversion)
  localStorage.setItem("bookingDates", JSON.stringify(serializedDates));
};


export const getMyBookings = () => async (dispatch, getState) => {
  try {
      dispatch({ type: BOOKING_LIST_MY_REQUEST });

      const {
          userLogin: { userInfo },
      } = getState();

      const config = {
          headers: {
              Authorization: `Bearer ${userInfo.token}`,
          },
      };

      const { data } = await axios.get(`https://easyway-backend-e605862abcad.herokuapp.com/bookings/mybookings/`, config);

      
      console.log("Fetched bookings:", data); // Debugging line

      dispatch({
          type: BOOKING_LIST_MY_SUCCESS,
          payload: data,
      });
  } catch (error) {
      dispatch({
          type: BOOKING_LIST_MY_FAIL,
          payload: error.response && error.response.data.message ? error.response.data.message : error.message,
      });
  }
};

export const getBookingDetails = (bookingId) => async (dispatch, getState) => {
  try {
      const {
          userLogin: { userInfo },
      } = getState();

      const config = {
          headers: {
              Authorization: `Bearer ${userInfo.token}`,
          },
      };

      if (!bookingId) {
        throw new Error("Booking ID is required");
      }
      
      console.log("Booking ID:", bookingId);
      const { data } = await axios.get(`https://easyway-backend-e605862abcad.herokuapp.com/booking/${bookingId}/`, config);
      console.log("Booking details:", data);
          

      dispatch({
          type: "BOOKING_DETAILS_SUCCESS",
          payload: data,
      });
  } catch (error) {
      dispatch({
          type: "BOOKING_DETAILS_FAIL",
          payload:
              error.response && error.response.data.detail
                  ? error.response.data.detail
                  : error.message,
      });
  }
};

export const bookingReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SAVE_BOOKING_DATES":
      return { ...state, bookingDates: action.payload };
    default:
      return state;
  }
};

export const PayBooking = (bookingId) => async (dispatch, getState) => {
  try {

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    dispatch({
      type: BOOKING_PAY_REQUEST
    })

  const { data } = await axios.put(`https://easyway-backend-e605862abcad.herokuapp.com/bookings/${bookingId}/pay`, {}, config);

  dispatch({
    type: BOOKING_PAY_SUCCESS,
    payload: data,
  })
  } catch (error) {
    dispatch({
      type: BOOKING_PAY_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    })
  }
}

export const createBooking = (bookingData) => async (dispatch, getState) => {
  try {
      dispatch({ type: BOOKING_CREATE_REQUEST });

      const {
          userLogin: { userInfo },
      } = getState();

      const config = {
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userInfo.token}`,
          },
      };

      const { data } = await axios.post("https://easyway-backend-e605862abcad.herokuapp.com/booking/create/", bookingData, config);

      dispatch({
          type: BOOKING_CREATE_SUCCESS,
          payload: data,
      });

      return data; // Return booking data for redirection in UI
  } catch (error) {
      dispatch({
          type: BOOKING_CREATE_FAIL,
          payload: error.response?.data?.message || "Failed to create booking",
      });
  }
};