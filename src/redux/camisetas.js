import * as ActionTypes from './ActionTypes';

export const camisetas = (state = { isLoading: true, errMess: null, camisetas: [] }, action) => {
    switch (action.type) {
        case ActionTypes.ADD_CAMISETAS:
            return { ...state, isLoading: false, errMess: null, camisetas: action.payload };
        case ActionTypes.CAMISETAS_LOADING:
            return { ...state, isLoading: true, errMess: null, camisetas: [] };
        case ActionTypes.CAMISETAS_FAILED:
            return { ...state, isLoading: false, errMess: action.payload };
        default:
            return state;
    }
};
