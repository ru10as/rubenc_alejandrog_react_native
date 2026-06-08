import * as ActionTypes from './ActionTypes';

const initialState = {
    items: [],
    isLoading: true, // Para saber si estamos cargando los datos
    errMess: null    // Para guardar mensajes de error si fallan
};

export const ofertas = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.ADD_OFERTAS:
            return {
                ...state,
                items: action.payload,
                isLoading: false,
                errMess: null
            };

        case 'OFERTAS_LOADING': 
            return { ...state, isLoading: true };

        case 'OFERTAS_FAILED':
            return { ...state, isLoading: false, errMess: action.payload };

        case ActionTypes.LOGOUT_SUCCESS:
            return initialState;

        default:
            return state;
    }
};