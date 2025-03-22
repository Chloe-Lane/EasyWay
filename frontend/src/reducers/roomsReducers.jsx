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
} from '../constants/roomConstants';

export const roomsListReducer = (state = { rooms: [], loading: false }, action) => {
    switch (action.type) {
        case ROOM_LIST_REQUEST: 
            return { loading: true, rooms: [] };
        case ROOM_LIST_SUCCESS:  
            return { loading: false, rooms: action.payload };
        case ROOM_LIST_FAIL:  
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const roomDetailsReducer = (state = { room: {}, loading: false }, action) => {
    switch (action.type) {
        case ROOM_DETAILS_REQUEST: 
            return { loading: true, room: {} };
        case ROOM_DETAILS_SUCCESS:  
            return { loading: false, room: action.payload };
        case ROOM_DETAILS_FAIL:  
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}

export const searchRoomsReducer = (state = { rooms: [] }, action) => {
    switch (action.type) {
        case ROOM_SEARCH_REQUEST:
            return { loading: true, rooms: [] };

        case ROOM_SEARCH_SUCCESS:
            return { loading: false, rooms: action.payload };

        case ROOM_SEARCH_FAIL:
            return { loading: false, error: action.payload };

        default:
            return state;
    }
};


export const roomCreateReducer = (state = {}, action) => {
    switch (action.type) {
      case ROOM_CREATE_REQUEST:
        return { loading: true };
      case ROOM_CREATE_SUCCESS:
        return { loading: false, success: true, room: action.payload };
      case ROOM_CREATE_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const amenityListReducer = (state = { amenities: [] }, action) => {
    switch (action.type) {
      case AMENITY_LIST_REQUEST:
        return { loading: true, amenities: [] };
      case AMENITY_LIST_SUCCESS:
        return { loading: false, amenities: action.payload };
      case AMENITY_LIST_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const policyListReducer = (state = { policies: [] }, action) => {
    switch (action.type) {
      case POLICY_LIST_REQUEST:
        return { loading: true, policies: [] };
      case POLICY_LIST_SUCCESS:
        return { loading: false, policies: action.payload };
      case POLICY_LIST_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };