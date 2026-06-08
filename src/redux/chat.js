import * as ActionTypes from './ActionTypes';

export const chat = (state = { mensajes: [] }, action) => {
    switch (action.type) {
        case ActionTypes.ADD_MENSAJES:
            return { ...state, mensajes: action.payload };
        
        default:
            return state;
    }
};