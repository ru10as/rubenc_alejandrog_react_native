import * as ActionTypes from './ActionTypes';

// Definimos un estado inicial claro
const initialState = {
    ofertas: [],
    isLoading: false
};

export const ventas = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.VENTAS_LOADING:
            return { 
                ...state, 
                isLoading: true 
            };

        case ActionTypes.ADD_OFERTA_A_VENTA:
            return { 
                ...state, 
                ofertas: action.payload, 
                isLoading: false 
            };
        
        case ActionTypes.ACTUALIZAR_VENTA:
            return { 
                ...state, 
                ofertas: state.ofertas.map(o => 
                    o.id === action.payload.id ? { ...o, ...action.payload } : o
                ) 
            };

        case ActionTypes.LOGOUT_SUCCESS:
            return initialState;

        default:
            return state;
    }
};