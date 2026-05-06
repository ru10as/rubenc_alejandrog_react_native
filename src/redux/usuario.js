import * as ActionTypes from './ActionTypes';

export const usuario = (state = { user: null, errMess: null }, action) => {
    switch (action.type) {
        case ActionTypes.LOGIN_SUCCESS:
            return { ...state, user: action.payload, errMess: null };

        case ActionTypes.LOGOUT_SUCCESS:
            return { ...state, user: null, errMess: null };

        case ActionTypes.AUTH_FAILED:
            return { ...state, user: null, errMess: action.payload };

        default:
            return state;
    }
};