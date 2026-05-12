import * as ActionTypes from './ActionTypes';
import { db, auth } from '../api/firebaseConfig';
import { collection, getDocs, addDoc, doc, setDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth"; // Necesario para llevar a cabo la autenticacion con firebase
import { Alert } from 'react-native';

// --- COMENTARIOS ---
export const fetchComentarios = () => async (dispatch) => {
    try {
        const querySnapshot = await getDocs(collection(db, "comentarios"));
        const comentarios = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        dispatch(addComentarios(comentarios));
    } catch (error) {
        dispatch(comentariosFailed(error.message));
    }
};

export const comentariosFailed = (errmess) => ({ type: ActionTypes.COMENTARIOS_FAILED, payload: errmess });
export const addComentarios = (comentarios) => ({ type: ActionTypes.ADD_COMENTARIOS, payload: comentarios });


// --- CAMISETAS ---
export const fetchCamisetas = () => async (dispatch) => {
    dispatch(camisetasLoading());
    try {
        const querySnapshot = await getDocs(collection(db, "camisetas"));
        const camisetas = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        dispatch(addCamisetas(camisetas));
    } catch (error) {
        dispatch(camisetasFailed(error.message));
    }
};

export const camisetasLoading = () => ({ type: ActionTypes.CAMISETAS_LOADING });
export const camisetasFailed = (errmess) => ({ type: ActionTypes.CAMISETAS_FAILED, payload: errmess });
export const addCamisetas = (camisetas) => ({ type: ActionTypes.ADD_CAMISETAS, payload: camisetas });


// --- CABECERAS ---
export const fetchCabeceras = () => async (dispatch) => {
    dispatch(cabecerasLoading());
    try {
        const querySnapshot = await getDocs(collection(db, "cabeceras"));
        const cabeceras = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        dispatch(addCabeceras(cabeceras));
    } catch (error) {
        dispatch(cabecerasFailed(error.message));
    }
};

export const cabecerasLoading = () => ({ type: ActionTypes.CABECERAS_LOADING });
export const cabecerasFailed = (errmess) => ({ type: ActionTypes.CABECERAS_FAILED, payload: errmess });
export const addCabeceras = (cabeceras) => ({ type: ActionTypes.ADD_CABECERAS, payload: cabeceras });


// --- NOVEDADES ---
export const fetchNovedades = () => async (dispatch) => {
    dispatch(novedadesLoading());
    try {
        const querySnapshot = await getDocs(collection(db, "novedades"));
        const novedades = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        dispatch(addNovedades(novedades));
    } catch (error) {
        dispatch(novedadesFailed(error.message));
    }
};

export const novedadesLoading = () => ({ type: ActionTypes.NOVEDADES_LOADING });
export const novedadesFailed = (errmess) => ({ type: ActionTypes.NOVEDADES_FAILED, payload: errmess });
export const addNovedades = (novedades) => ({ type: ActionTypes.ADD_NOVEDADES, payload: novedades });


// --- FAVORITOS Y POSTS ---
export const postFavorito = (camisetaId, usuarioId) => async (dispatch) => {
    try {
        await addDoc(collection(db, "favoritos"), {
            usuarioId: usuarioId,
            camisetaId: camisetaId,
            fecha: new Date().toISOString()
        });

        dispatch(addFavorito(camisetaId));
    } catch (error) {
        console.error("Error al guardar favorito:", error.message);
    }
};

export const addFavorito = (camisetaId) => ({ type: ActionTypes.ADD_FAVORITO, payload: camisetaId });

export const postComentario = (camisetaId, valoracion, autor, comentario) => async (dispatch) => {
    const nuevoComentario = {
        camisetaId: camisetaId,
        valoracion: valoracion,
        autor: autor,
        comentario: comentario,
        dia: new Date().toISOString()
    };

    try {
        await addDoc(collection(db, "comentarios"), nuevoComentario);
        dispatch(addComentario(nuevoComentario));
    } catch (error) {
        console.log("Error al publicar comentario:", error.message);
    }
};

export const addComentario = (comentario) => ({ type: ActionTypes.ADD_COMENTARIO, payload: comentario });

//const extractUser = (firebaseUser) => ({
//    uid: firebaseUser.uid,
//    email: firebaseUser.email,
//    displayName: firebaseUser.displayName ?? null,
//    photoURL: firebaseUser.photoURL ?? null,
//});

const extractUser = (firebaseUser) => ({
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName ?? null,
    photoURL: firebaseUser.photoURL ?? null,
});

// ACCIÓN PARA REGISTRO MANUAL
export const signUp = (email, password) => async (dispatch) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const userData = {
            uid: user.uid,
            email: user.email,
            favoritos: [],
            fechaRegistro: new Date().toISOString()
        };
        dispatch({ type: 'LOGIN_SUCCESS', payload: userData });
        setDoc(doc(db, "usuarios", user.uid), userData)
            .then(() => console.log("Perfil creado en DB"))
            .catch(e => console.log("Error en DB (pero el usuario ya entró):", e));

    } catch (error) {
        Alert.alert("Error en Registro", error.message);
    }
};

// ACCIÓN PARA LOGIN MANUAL
export const login = (email, password) => async (dispatch) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    dispatch({ type: 'LOGIN_SUCCESS', payload: extractUser(userCredential.user) });
};

// --- LOGOUT ---
export const logout = () => async (dispatch) => {
    try {
        await signOut(auth); // Le dice a Firebase: "Cierra la sesión"
        dispatch({ type: ActionTypes.LOGOUT_SUCCESS }); // Limpia el Reducer (pone user: null)
    } catch (error) {
        console.error("Error al cerrar sesión:", error.message);
    }
};