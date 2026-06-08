import * as ActionTypes from './ActionTypes';

export const ventas = (state = { ofertas: [] }, action) => {
    switch (action.type) {
        case ActionTypes.ADD_OFERTAS:
            return { ...state, ofertas: action.payload };
        
        case ActionTypes.ACTUALIZAR_OFERTA:
            return { 
                ...state, 
                ofertas: state.ofertas.map(o => o.id === action.payload.id ? { ...o, ...action.payload } : o) 
            };

        default:
            return state;
    }
};