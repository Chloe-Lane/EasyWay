import { MAP_SET_LOCATION, MAP_SET_ERROR } from "../constants/mapConstants";

const initialState = {
    latitude: 51.505,
    longitude: -0.09,
    error: null,
};

export const mapReducer = (state = initialState, action) => {
    switch (action.type) {
        case MAP_SET_LOCATION:
            console.log("Map Location Updated:", action.payload); // 🔍 Debugging
            return {
                ...state,
                latitude: action.payload.latitude,
                longitude: action.payload.longitude,
                error: null,
            };
        case MAP_SET_ERROR:
            return { ...state, error: action.payload };
        default:
            return state;
    }
};
