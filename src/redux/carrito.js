import * as ActionTypes from './ActionTypes';

const initialState = {
    items: [],
    totalDescuento: 0,
    cuponesAplicados: []
};

export const carrito = (state = initialState, action) => {
    switch (action.type) {
        
        case ActionTypes.AUTH_LOGOUT:
        case ActionTypes.LIMPIAR_CARRITO:
            return initialState;

        case ActionTypes.ANADIR_CARRITO: {
            const { camiseta, talla } = action.payload;
            const existe = state.items.find(i => i.camiseta.id === camiseta.id && i.talla === talla);

            if (existe) {
                return {
                    ...state,
                    items: state.items.map(i =>
                        (i.camiseta.id === camiseta.id && i.talla === talla)
                            ? { ...i, cantidad: i.cantidad + 1 }
                            : i
                    )
                };
            }
            return { 
                ...state, 
                items: [...state.items, { camiseta, talla, cantidad: 1 }] 
            };
        }

        case ActionTypes.RESTAR_CARRITO: {
            const { id, talla } = action.payload;
            return {
                ...state,
                items: state.items
                    .map(i => 
                        (i.camiseta.id === id && i.talla === talla) 
                            ? { ...i, cantidad: i.cantidad - 1 } 
                            : i
                    )
                    .filter(i => i.cantidad > 0)
            };
        }

        case ActionTypes.ELIMINAR_CARRITO: {
            const { id, talla } = action.payload;
            return {
                ...state,
                items: state.items.filter(
                    i => !(i.camiseta.id === id && i.talla === talla)
                )
            };
        }

        // Este es el que gestiona la sincronización en tiempo real (Firebase -> Redux)
        case ActionTypes.CARRITO_ACTUALIZAR:
            return {
                ...state,
                items: action.payload.items || state.items,
                totalDescuento: action.payload.totalDescuento || 0,
                cuponesAplicados: action.payload.cuponesAplicados || []
            };

        case ActionTypes.ACTUALIZAR_DATOS_CARRITO:
            return {
                ...state,
                totalDescuento: action.payload.totalDescuento,
                cuponesAplicados: action.payload.cuponesAplicados
            };

        case ActionTypes.CARRITO_CARGAR:
            return {
                ...state,
                items: Array.isArray(action.payload.items) ? action.payload.items : (Array.isArray(action.payload) ? action.payload : []),
                totalDescuento: action.payload.totalDescuento || 0,
                cuponesAplicados: action.payload.cuponesAplicados || []
            };

        default:
            return state;
    }
};