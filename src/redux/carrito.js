import * as ActionTypes from './ActionTypes';

const initialState = {
    items: [], // Estructura: [{ camiseta: {...}, talla: 'M', cantidad: 1 }]
};

export const carrito = (state = initialState, action) => {
    switch (action.type) {
        
        case ActionTypes.ANADIR_CARRITO: {
            const { camiseta, talla } = action.payload;
            const indice = state.items.findIndex(
                i => i.camiseta.id === camiseta.id && i.talla === talla
            );
            
            if (indice !== -1) {
                // Si existe, creamos una copia del array y actualizamos la cantidad
                const nuevosItems = [...state.items];
                nuevosItems[indice].cantidad += 1;
                return { ...state, items: nuevosItems };
            }
            // Si no existe, lo añadimos como nuevo
            return { 
                ...state, 
                items: [...state.items, { camiseta, talla, cantidad: 1 }] 
            };
        }

        case ActionTypes.RESTAR_CARRITO: {
            const { id, talla } = action.payload;
            return {
                ...state,
                // Restamos cantidad y filtramos automáticamente los que lleguen a 0
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

        case ActionTypes.LIMPIAR_CARRITO:
            return initialState;

        default:
            return state;
    }
};