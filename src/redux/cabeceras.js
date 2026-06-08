import * as ActionTypes from './ActionTypes';

export const cabeceras = (state = { isLoading: true, errMess: null, cabeceras: [] }, action) => {
    switch (action.type) {
        case ActionTypes.ADD_CABECERAS:
            return { ...state, isLoading: false, errMess: null, cabeceras: action.payload };

        case ActionTypes.CABECERAS_LOADING:
            // Mantenemos lo que ya tenemos en pantalla mientras cargamos lo nuevo
            return { ...state, isLoading: true, errMess: null };

        case ActionTypes.CABECERAS_FAILED:
            return { ...state, isLoading: false, errMess: action.payload };

        default:
            return state;
    }
};
