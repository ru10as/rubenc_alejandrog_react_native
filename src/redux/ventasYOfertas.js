import * as ActionTypes from './ActionTypes';

const initialState = {
    recibidas: [],    // Ofertas que otros te han hecho
    enviadas: [],     // Ofertas que tú has hecho
    ventas: [],       // Tus propias camisetas en inventario
    isLoading: false,
    errMess: null
};

export const ventasYOfertas = (state = initialState, action) => {
    switch (action.type) {
        // --- LOADING ---
        case ActionTypes.OFERTAS_LOADING:
        case ActionTypes.VENTAS_LOADING:
            return { ...state, isLoading: true, errMess: null };

        // --- ADDERS (Carga de datos) ---
        case ActionTypes.ADD_OFERTAS_RECIBIDAS:
            return { ...state, isLoading: false, recibidas: action.payload };

        case ActionTypes.ADD_OFERTAS_ENVIADAS:
            return { ...state, isLoading: false, enviadas: action.payload };

        case ActionTypes.ADD_VENTAS:
            return { ...state, isLoading: false, ventas: action.payload };

        // --- ACTUALIZACIONES (Vital para el cambio de estado) ---
        case ActionTypes.ACTUALIZAR_OFERTA:
            return {
                ...state,
                recibidas: state.recibidas.map(o => 
                    o.id === action.payload.id ? { ...o, ...action.payload } : o
                )
            };

        case ActionTypes.ACTUALIZAR_VENTA:
            return {
                ...state,
                ventas: state.ventas.map(v => 
                    v.id === action.payload.id ? { ...v, ...action.payload } : v
                )
            };

        // --- ERRORES ---
        case ActionTypes.OFERTAS_FAILED:
        case ActionTypes.VENTAS_FAILED:
            return { ...state, isLoading: false, errMess: action.payload };

        // --- RESET ---
        case ActionTypes.AUTH_LOGOUT:
            return initialState;

        default:
            return state;
    }
};