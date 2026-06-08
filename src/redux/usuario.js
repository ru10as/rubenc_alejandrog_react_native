import * as ActionTypes from './ActionTypes';

const initialState = {
    user: null,       // El objeto del usuario
    isLoading: false, // Estado de carga (útil para login/register)
    errMess: null     // Cualquier error de Firebase/Auth
};

export const usuario = (state = initialState, action) => {
    switch (action.type) {
        
        case ActionTypes.AUTH_LOADING:
            return { ...state, isLoading: true, errMess: null };

        case ActionTypes.AUTH_SUCCESS:
            return { ...state, user: action.payload, isLoading: false, errMess: null };

        case ActionTypes.AUTH_FAILED:
            return { ...state, user: null, isLoading: false, errMess: action.payload };

        case ActionTypes.AUTH_LOGOUT:
            return initialState;

        default:
            return state;
    }
};