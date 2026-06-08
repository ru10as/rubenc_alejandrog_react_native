import * as ActionTypes from './ActionTypes';

export const comentarios = (state = { isLoading: true, errMess: null, comentarios: [] }, action) => {
    switch (action.type) {
        case ActionTypes.COMENTARIOS_LOADING: // Añadimos el caso de carga
            return { ...state, isLoading: true, errMess: null };

        case ActionTypes.ADD_COMENTARIOS:
            return { ...state, isLoading: false, errMess: null, comentarios: action.payload };

        case ActionTypes.COMENTARIOS_FAILED:
            return { ...state, isLoading: false, errMess: action.payload };

        case ActionTypes.ADD_COMENTARIO:
            return { ...state, comentarios: state.comentarios.concat(action.payload) };

        default:
            return state;
    }
};