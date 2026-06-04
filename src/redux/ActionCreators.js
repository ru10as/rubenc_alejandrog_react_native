import * as ActionTypes from './ActionTypes';
import { db, auth } from '../api/firebaseConfig';
import { collection, getDocs, addDoc, doc, setDoc, getDoc } from 'firebase/firestore';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithCredential,
} from "firebase/auth";
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { Alert } from 'react-native';
import { registrarTokenPush } from '../comun/notificaciones';

// Registra el push token sin romper el flujo de login si falla.
const registrarTokenSeguro = async (uid) => {
    try {
        await registrarTokenPush(uid);
    } catch (err) {
        console.warn('No se pudo registrar el token push:', err?.message);
    }
};

// --- COMENTARIOS ---
export const fetchComentarios = () => async (dispatch) => {
    try {
        const querySnapshot = await getDocs(collection(db, "comentarios"));
        const comentarios = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...serializarFirestore(doc.data()),
        }));
        dispatch(addComentarios(comentarios));
    } catch (error) {
        dispatch(comentariosFailed(error.message));
    }
};

export const comentariosFailed = (errmess) => ({ type: ActionTypes.COMENTARIOS_FAILED, payload: errmess });
export const addComentarios = (comentarios) => ({ type: ActionTypes.ADD_COMENTARIOS, payload: comentarios });


// Convierte recursivamente Timestamp de Firestore (y otros valores no
// serializables) en strings/numeros antes de meterlos en Redux.
const serializarFirestore = (valor) => {
    if (valor === null || valor === undefined) return valor;
    if (typeof valor !== 'object') return valor;
    if (typeof valor.toDate === 'function') return valor.toDate().toISOString();
    if (Array.isArray(valor)) return valor.map(serializarFirestore);
    const salida = {};
    for (const clave of Object.keys(valor)) {
        salida[clave] = serializarFirestore(valor[clave]);
    }
    return salida;
};

// --- CAMISETAS ---
export const fetchCamisetas = () => async (dispatch) => {
    dispatch(camisetasLoading());
    try {
        const querySnapshot = await getDocs(collection(db, "camisetas"));
        const camisetas = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...serializarFirestore(doc.data()),
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
            ...serializarFirestore(doc.data()),
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
            ...serializarFirestore(doc.data()),
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
        dispatch({ type: ActionTypes.LOGIN_SUCCESS, payload: userData });
        setDoc(doc(db, "usuarios", user.uid), userData)
            .then(() => console.log("Perfil creado en DB"))
            .catch(e => console.log("Error en DB (pero el usuario ya entró):", e));
        await registrarTokenSeguro(user.uid);
    } catch (error) {
        Alert.alert("Error en Registro", error.message);
    }
};

// ACCIÓN PARA LOGIN MANUAL
export const login = (email, password) => async (dispatch) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    dispatch({ type: ActionTypes.LOGIN_SUCCESS, payload: extractUser(userCredential.user) });
    await registrarTokenSeguro(userCredential.user.uid);
    dispatch(cargarCarritoDesdeFirebase(userCredential.user.uid));
};

// ACCIÓN PARA LOGIN CON GOOGLE (nativo + Firebase)
export const loginWithGoogle = () => async (dispatch) => {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const response = await GoogleSignin.signIn();
    const idToken = response?.data?.idToken ?? response?.idToken;
    if (!idToken) {
        throw new Error("No se obtuvo el ID Token de Google");
    }
    const credential = GoogleAuthProvider.credential(idToken);
    const userCredential = await signInWithCredential(auth, credential);
    const user = userCredential.user;

    const userRef = doc(db, "usuarios", user.uid);
    const snapshot = await getDoc(userRef);
    if (!snapshot.exists()) {
        await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName ?? null,
            photoURL: user.photoURL ?? null,
            favoritos: [],
            fechaRegistro: new Date().toISOString(),
            proveedor: 'google',
        });
    }

    dispatch({ type: ActionTypes.LOGIN_SUCCESS, payload: extractUser(user) });
    dispatch(cargarCarritoDesdeFirebase(user.uid));
    await registrarTokenSeguro(user.uid);
};

// Rehidrata el estado de Redux si Firebase ya tiene una sesión persistida.
export const restoreSession = (firebaseUser) => (dispatch) => {
    if (firebaseUser) {
        dispatch({ type: ActionTypes.LOGIN_SUCCESS, payload: extractUser(firebaseUser) });
        dispatch(cargarCarritoDesdeFirebase(firebaseUser.uid));
    } else {
        dispatch({ type: ActionTypes.LOGOUT_SUCCESS });
    }
};

// --- LOGOUT ---
export const logout = () => async (dispatch) => {
    try {
        try {
            const isSignedIn = await GoogleSignin.getCurrentUser();
            if (isSignedIn) {
                await GoogleSignin.signOut();
            }
        } catch (gErr) {
            // Si Google Sign-In no estaba inicializado o falla, seguimos con el logout de Firebase
            console.warn("GoogleSignin.signOut falló (continúa):", gErr?.message);
        }
        await signOut(auth);
        dispatch({ type: ActionTypes.LOGOUT_SUCCESS });
    } catch (error) {
        console.error("Error al cerrar sesión:", error.message);
    }
};

export { statusCodes as googleStatusCodes };

const guardarEnFirebase = async (dispatch, getState) => {
    const { usuario, carrito } = getState();
    if (usuario?.user?.uid) {
        try {
            await setDoc(doc(db, "carritos", usuario.user.uid), { items: carrito.items });
        } catch (e) { 
            console.error("Error sincronizando carrito:", e); 
        }
    }
};

export const anadirAlCarrito = (camiseta, talla) => async (dispatch, getState) => {
    dispatch({ type: ActionTypes.ANADIR_CARRITO, payload: { camiseta, talla } });
    guardarEnFirebase(dispatch, getState);
};

export const restarDelCarrito = (id, talla) => async (dispatch, getState) => {
    dispatch({ type: ActionTypes.RESTAR_CARRITO, payload: { id, talla } });
    guardarEnFirebase(dispatch, getState);
};

export const eliminarDelCarrito = (id, talla) => async (dispatch, getState) => {
    dispatch({ type: ActionTypes.ELIMINAR_CARRITO, payload: { id, talla } });
    guardarEnFirebase(dispatch, getState);
};

export const limpiarCarrito = () => ({ type: ActionTypes.LIMPIAR_CARRITO });

// Función para cargar los datos desde Firebase
export const cargarCarritoDesdeFirebase = (uid) => async (dispatch) => {
    try {
        const docSnap = await getDoc(doc(db, "carritos", uid));
        if (docSnap.exists()) {
            dispatch({ type: ActionTypes.CARGAR_CARRITO, payload: docSnap.data().items });
        }
    } catch (e) { 
        console.error("Error cargando carrito:", e); 
    }
};