import * as ActionTypes from './ActionTypes';

export const novedades = (state = { isLoading: true, errMess: null, novedades: [] }, action) => {
    switch (action.type) {
        case ActionTypes.ADD_NOVEDADES:
            return { ...state, isLoading: false, errMess: null, novedades: action.payload };
        case ActionTypes.NOVEDADES_LOADING:
            return { ...state, isLoading: true, errMess: null, novedades: [] };
        case ActionTypes.NOVEDADES_FAILED:
            return { ...state, isLoading: false, errMess: action.payload };
        default:
            return state;
    }
};
