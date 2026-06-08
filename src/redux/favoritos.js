import * as ActionTypes from './ActionTypes';

// Añadimos el caso de limpieza al cerrar sesión
export const favoritos = (state = [], action) => {
    switch (action.type) {
        
        case ActionTypes.ADD_FAVORITO:
            // Verificamos si ya existe para no duplicar (muy bien hecho)
            if (state.some(id => id === action.payload)) return state;
            return state.concat(action.payload);

        case ActionTypes.DELETE_FAVORITO:
            // Añadimos la capacidad de quitar un favorito
            return state.filter(id => id !== action.payload);

        case ActionTypes.AUTH_LOGOUT:
            // Limpiamos los favoritos al cerrar sesión
            return [];

        default:
            return state;
    }
};