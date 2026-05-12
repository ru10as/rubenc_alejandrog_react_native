const initialState = {
    items: [], 
};

export const carrito = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_TO_CART':
            const existe = state.items.find(i => i.id === action.payload.id && i.talla === action.payload.talla);
            if (existe) {
                return {
                    ...state,
                    items: state.items.map(i => 
                        (i.id === action.payload.id && i.talla === action.payload.talla) 
                        ? { ...i, cantidad: i.cantidad + 1 } : i
                    )
                };
            }
            return { ...state, items: [...state.items, { ...action.payload, cantidad: 1 }] };

        case 'REMOVE_FROM_CART':
            return {
                ...state,
                items: state.items.filter(i => !(i.id === action.payload.id && i.talla === action.payload.talla))
            };

        case 'CLEAN_CART':
            return initialState;

        default:
            return state;
    }
};