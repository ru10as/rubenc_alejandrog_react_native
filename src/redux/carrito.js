import * as ActionTypes from './ActionTypes';

const initialState = {
    items: [], // Estructura: [{ camiseta: {...}, talla: 'M', cantidad: 1 }]
};

export const carrito = (state = initialState, action) => {
    switch (action.type) {
        
        case ActionTypes.ANADIR_CARRITO: {
            const { camiseta, talla } = action.payload;
            const existe = state.items.find(i => i.camiseta.id === camiseta.id && i.talla === talla);
            
            if (existe) {
                return {
                    ...state,
                    items: state.items.map(i => 
                        (i.camiseta.id === camiseta.id && i.talla === talla) 
                        ? { ...i, cantidad: i.cantidad + 1 } : i
                    )
                };
            }
            return { ...state, items: [...state.items, { camiseta, talla, cantidad: 1 }] };
        }

        case ActionTypes.RESTAR_CARRITO: {
            const { id, talla } = action.payload;
            return {
                ...state,
                items: state.items.map(i => 
                    (i.camiseta.id === id && i.talla === talla)
                        ? { ...i, cantidad: i.cantidad > 1 ? i.cantidad - 1 : 1 }
                        : i
                )
            };
        }

        case ActionTypes.ELIMINAR_CARRITO: {
            const { id, talla } = action.payload;
            return {
                ...state,
                items: state.items.filter(i => !(i.camiseta.id === id && i.talla === talla))
            };
        }

        case ActionTypes.LIMPIAR_CARRITO:
            return initialState;

        default:
            return state;
    }
};