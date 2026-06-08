import * as ActionTypes from './ActionTypes';

export const camisetas = (state = { isLoading: false, camisetas: [], errMess: null }, action) => {
    switch (action.type) {
        case ActionTypes.CAMISETAS_LOADING:
            return { ...state, isLoading: true };
        case ActionTypes.ADD_CAMISETAS:
            return { ...state, isLoading: false, camisetas: action.payload };
        case ActionTypes.CAMISETAS_FAILED:
            return { ...state, isLoading: false, errMess: action.payload };
        case ActionTypes.ACTUALIZAR_CAMISETA: // Vital para cuando se vende una
            return {
                ...state,
                camisetas: state.camisetas.map(c => 
                    c.id === action.payload.id ? { ...c, ...action.payload } : c
                )
            };
        default:
            return state;
    }
};