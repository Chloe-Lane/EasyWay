import {
    MAP_SET_LOCATION,
    MAP_SET_ERROR,
} from '../constants/mapConstants';

export const setMapLocation = (latitude, longitude) => ({
    type: MAP_SET_LOCATION,
    payload: { latitude, longitude },
});