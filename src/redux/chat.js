import * as ActionTypes from './ActionTypes';

export const chat = (state = { mensajes: [], isLoading: false }, action) => {
    switch (action.type) {
        case ActionTypes.CHAT_LOADING:
            return { ...state, isLoading: true };

        case ActionTypes.CHAT_ADD_MENSAJES:
            return { 
                ...state, 
                isLoading: false, 
                mensajes: action.payload 
            };
        
        default:
            return state;
    }
};