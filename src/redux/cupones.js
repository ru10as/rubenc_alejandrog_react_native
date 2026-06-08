import * as ActionTypes from './ActionTypes';

const initialState = {
    items: [],
    isLoading: false, // Añadido para consistencia
    errMess: null     // Añadido para consistencia
};

export const cupones = (state = initialState, action) => {
    switch (action.type) {
        
        case ActionTypes.ADD_CUPONES:
            return {
                ...state,
                items: action.payload,
                isLoading: false,
                errMess: null
            };

        case ActionTypes.AUTH_LOGOUT:
            return initialState;

        default:
            return state;
    }
};