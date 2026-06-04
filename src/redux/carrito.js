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
                // Inmutabilidad total: usamos .map para crear una copia nueva del array y del objeto modificado
                return {
                    ...state,
                    items: state.items.map(i =>
                        (i.camiseta.id === camiseta.id && i.talla === talla)
                            ? { ...i, cantidad: i.cantidad + 1 }
                            : i
                    )
                };
            }
            // Si no existe, creamos un nuevo array con el nuevo item
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

        case ActionTypes.LIMPIAR_CARRITO:
            return initialState;

        case ActionTypes.CARGAR_CARRITO:
            // Este caso es el que usaréis al traer los datos de Firebase
            return {
                ...state,
                items: action.payload || []
            };

        default:
            return state;
    }
};