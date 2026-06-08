import * as ActionTypes from './ActionTypes';
import { db, auth } from '../api/firebaseConfig';
import { collection, onSnapshot, addDoc,serverTimestamp,writeBatch,doc, getDocs,getDoc, setDoc } from 'firebase/firestore';
import {createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,GoogleAuthProvider,signInWithCredential,} from "firebase/auth";
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Importación de Servicios y utilidades
import {suscribirseACarritoService,cargarCarritoDesdeFirebaseService, limpiarCarritoEnFirebaseService, 
    suscribirseACuponesService } from './services/cartService';
import { loginYRegistrarNotificacionesService,registrarUsuarioYNotificacionesService,logoutService } from './services/authService';
import { suscribirseAMensajesService, enviarMensajeService } from './services/chatService';
import {suscribirseAOfertasService, gestionarOfertaService } from './services/ventasService';
import { registrarTokenPush } from '../comun/notificaciones';

// SERIALIZACION
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

// TOKEN
const registrarTokenSeguro = async (uid) => {
    try {
        await registrarTokenPush(uid);
    } catch (err) {
        console.warn('No se pudo registrar el token push:', err?.message);
    }
};

// -- CARRITO --
export const suscribirseACarrito = (uid) => (dispatch) => {
    return suscribirseACarritoService(uid, (data) => 
        dispatch({ type: ActionTypes.ACTUALIZAR_DATOS_CARRITO, payload: data })
    );
};

export const cargarCarritoDesdeFirebase = (uid) => async (dispatch) => {
    try {
        const items = await cargarCarritoDesdeFirebaseService(uid);
        if (items) dispatch({ type: ActionTypes.CARGAR_CARRITO, payload: items });
    } catch (e) { console.error(e); }
};

export const limpiarCarrito = () => async (dispatch, getState) => {
    dispatch({ type: ActionTypes.LIMPIAR_CARRITO });
    const { usuario } = getState();
    if (usuario?.user?.uid) await limpiarCarritoEnFirebaseService(usuario.user.uid);
};

// -- CAMISETAS --
export const suscribirseACamisetas = () => (dispatch) => {
    return onSnapshot(collection(db, "camisetas"), (snapshot) => {
        const camisetas = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        dispatch({ type: ActionTypes.ADD_CAMISETAS, payload: camisetas });
    }, (error) => dispatch({ type: ActionTypes.CAMISETAS_FAILED, payload: error.message }));
};

export const addCamisetaAlStore = (camiseta) => ({
    type: 'ADD_CAMISETA',
    payload: camiseta
});

// -- CHAT --
export const suscribirseAMensajes = (ofertaId, callback) => (dispatch) => {
    return suscribirseAMensajesService(ofertaId, (mensajes) => {
        dispatch({ type: ActionTypes.ADD_MENSAJES, payload: mensajes });
        if (callback) callback(mensajes);
    });
};

export const enviarMensaje = (oferta, contenido, usuarioId) => async () => {
    try { await enviarMensajeService(oferta, contenido, usuarioId); }
    catch (error) { console.error(error); }
};

// -- AUTENTICACIÓN (LOGIN/REGISTRO) --
export const loginYRegistrarNotificaciones = (email, password) => async (dispatch) => {
    dispatch({ type: ActionTypes.LOGIN_LOADING });
    try {
        const usuario = await loginYRegistrarNotificacionesService(email, password);
        dispatch({ type: ActionTypes.LOGIN_SUCCESS, payload: usuario });
        return usuario;
    } catch (error) {
        dispatch({ type: ActionTypes.LOGIN_FAILED, payload: error.message });
        throw error;
    }
};

export const registrarUsuarioYNotificaciones = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: ActionTypes.LOGIN_LOADING });
        const usuario = await registrarUsuarioYNotificacionesService(email, password);
        dispatch({ type: ActionTypes.LOGIN_SUCCESS, payload: usuario });
        return usuario;
    } catch (error) {
        dispatch({ type: ActionTypes.LOGIN_FAILED, payload: error.message });
        throw error;
    }
};

// -- VENTAS Y OFERTAS --
export const suscribirseAOfertas = (uid) => (dispatch) => {
    return suscribirseAOfertasService(uid, (ofertas) => 
        dispatch({ type: ActionTypes.ADD_OFERTAS, payload: ofertas })
    );
};

export const gestionarOferta = (oferta, nuevoEstado) => async (dispatch) => {
    await gestionarOfertaService(oferta, nuevoEstado);
    if (nuevoEstado === 'aceptada') {
        dispatch({ type: ActionTypes.ACTUALIZAR_CAMISETA, payload: { id: oferta.camisetaId, estadoVenta: 'vendida' } });
    }
};

// LOGIN WITH GOOGLE
const extractUser = (firebaseUser) => ({
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName ?? null,
    photoURL: firebaseUser.photoURL ?? null,
});

export const loginWithGoogle = () => async (dispatch) => {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const response = await GoogleSignin.signIn();
    const idToken = response?.data?.idToken ?? response?.idToken;
    const cred = await signInWithCredential(auth, GoogleAuthProvider.credential(idToken));
    const user = cred.user;
    
    const snapshot = await getDoc(doc(db, "usuarios", user.uid));
    if (!snapshot.exists()) {
        await setDoc(doc(db, "usuarios", user.uid), { uid: user.uid, email: user.email, favoritos: [], proveedor: 'google' });
    }
    dispatch({ type: ActionTypes.LOGIN_SUCCESS, payload: extractUser(user) });
    dispatch(cargarCarritoDesdeFirebase(user.uid));
    await registrarTokenSeguro(user.uid);
};

// LOGOUT
export const logout = () => async (dispatch) => {
    try {
        const user = await GoogleSignin.getCurrentUser();
        if (user) await GoogleSignin.signOut();
        await signOut(auth);

        dispatch({ type: ActionTypes.LOGOUT_SUCCESS });
        dispatch({ type: ActionTypes.LIMPIAR_CARRITO }); 

    } catch (error) { 
        console.error("Error al cerrar sesión:", error.message); 
    }
};

// CAMISETAS
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

// DESCUENTOS
export const suscribirseACupones = (uid) => (dispatch) => {
    return suscribirseACuponesService(uid, (cupones) => 
        dispatch({ type: ActionTypes.ADD_CUPONES, payload: cupones })
    );
};