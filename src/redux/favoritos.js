import * as ActionTypes from './ActionTypes';

// Añadimos el caso de limpieza al cerrar sesión
export const favoritos = (state = [], action) => {
    switch (action.type) {
        
        case ActionTypes.ADD_FAVORITO:
            if (state.some(id => id === action.payload)) return state;
            return state.concat(action.payload);

        case ActionTypes.DELETE_FAVORITO:
            return state.filter(id => id !== action.payload);

        case ActionTypes.AUTH_LOGOUT:
            return [];

        default:
            return state;
    }
};