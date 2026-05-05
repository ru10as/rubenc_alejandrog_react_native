import * as ActionTypes from './ActionTypes';
import { baseUrl } from '../comun/comun';

// --- COMENTARIOS ---
export const fetchComentarios = () => (dispatch) => {
    return fetch(baseUrl + 'comentarios')
    .then(response => {
        if (response.ok) return response;
        throw new Error('Error ' + response.status + ': ' + response.statusText);
    })
    .then(response => response.json())
    .then(comentarios => dispatch(addComentarios(comentarios)))
    .catch(error => dispatch(comentariosFailed(error.message)));
};

export const comentariosFailed = (errmess) => ({
    type: ActionTypes.COMENTARIOS_FAILED,
    payload: errmess
});

export const addComentarios = (comentarios) => ({
    type: ActionTypes.ADD_COMENTARIOS,
    payload: comentarios
});

// --- CAMISETAS ---
export const fetchCamisetas = () => (dispatch) => {
    dispatch(camisetasLoading());
    return fetch(baseUrl + 'camisetas')
    .then(response => {
        if (response.ok) return response;
        throw new Error('Error ' + response.status + ': ' + response.statusText);
    })
    .then(response => response.json())
    .then(camisetas => dispatch(addCamisetas(camisetas)))
    .catch(error => dispatch(camisetasFailed(error.message)));
};

export const camisetasLoading = () => ({ type: ActionTypes.CAMISETAS_LOADING });
export const camisetasFailed = (errmess) => ({ type: ActionTypes.CAMISETAS_FAILED, payload: errmess });
export const addCamisetas = (camisetas) => ({ type: ActionTypes.ADD_CAMISETAS, payload: camisetas });

// --- CABECERAS ---
export const fetchCabeceras = () => (dispatch) => {
    dispatch(cabecerasLoading());
    return fetch(baseUrl + 'cabeceras')
    .then(response => {
        if (response.ok) return response;
        throw new Error('Error ' + response.status + ': ' + response.statusText);
    })
    .then(response => response.json())
    .then(cabeceras => dispatch(addCabeceras(cabeceras)))
    .catch(error => dispatch(cabecerasFailed(error.message)));
};

export const cabecerasLoading = () => ({ type: ActionTypes.CABECERAS_LOADING });
export const cabecerasFailed = (errmess) => ({ type: ActionTypes.CABECERAS_FAILED, payload: errmess });
export const addCabeceras = (cabeceras) => ({ type: ActionTypes.ADD_CABECERAS, payload: cabeceras });

// --- NOVEDADES ---
export const fetchNovedades = () => (dispatch) => {
    dispatch(novedadesLoading());
    return fetch(baseUrl + 'novedades')
    .then(response => {
        if (response.ok) return response;
        throw new Error('Error ' + response.status + ': ' + response.statusText);
    })
    .then(response => response.json())
    .then(novedades => dispatch(addNovedades(novedades)))
    .catch(error => dispatch(novedadesFailed(error.message)));
};

export const novedadesLoading = () => ({ type: ActionTypes.NOVEDADES_LOADING });
export const novedadesFailed = (errmess) => ({ type: ActionTypes.NOVEDADES_FAILED, payload: errmess });
export const addNovedades = (novedades) => ({ type: ActionTypes.ADD_NOVEDADES, payload: novedades });

// --- FAVORITOS ---
export const postFavorito = (camisetaId) => (dispatch) => {
    setTimeout(() => {
        dispatch(addFavorito(camisetaId));
    }, 2000);
};

export const addFavorito = (camisetaId) => ({
    type: ActionTypes.ADD_FAVORITO,
    payload: camisetaId
});

// --- COMENTARIO INDIVIDUAL ---
export const postComentario = (camisetaId, valoracion, autor, comentario) => (dispatch) => {
    const nuevoComentario = {
        camisetaId,
        valoracion,
        autor,
        comentario,
        dia: new Date().toISOString()
    };
    setTimeout(() => {
        dispatch(addComentario(nuevoComentario));
    }, 2000);
};

export const addComentario = (comentario) => ({
    type: ActionTypes.ADD_COMENTARIO,
    payload: comentario
});
