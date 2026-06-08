import * as ActionTypes from './ActionTypes';
import { db, auth } from '../api/firebaseConfig';
import { collection, runTransaction,onSnapshot,where, addDoc,serverTimestamp,writeBatch,doc, getDocs,getDoc, setDoc,query } from 'firebase/firestore';
import {createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,GoogleAuthProvider,signInWithCredential,} from "firebase/auth";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
// Importación de Servicios y utilidades
import {suscribirseACarritoService,cargarCarritoDesdeFirebaseService, limpiarCarritoEnFirebaseService, 
    suscribirseACuponesService } from './services/cartService';
import { loginYRegistrarNotificacionesService,registrarUsuarioYNotificacionesService,logoutService } from './services/authService';
import { suscribirseAMensajesService, enviarMensajeService } from './services/chatService';
import {suscribirseAOfertasService, gestionarOfertaService,suscribirseAMisComprasService } from './services/ventasService';
import { registrarTokenPush } from '../comun/notificaciones';

// VISTO
// ----- COMENTARIOS -------------------------------------------------------------------------------------
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
// --------------------------------------------------------------------------------------------------------------


// VISTO
// ----- SERIALIZACION ------------------------------------------------------------------------------------------
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
// --------------------------------------------------------------------------------------------------------------


// VISTO
// ----- CABECERAS -----------------------------------------------------------------------------------------------
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
// ---------------------------------------------------------------------------------------------------------


// VISTO
// ----- NOVEDADES ------------------------------------------------------------------------------------------
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
// ---------------------------------------------------------------------------------------------------------


// VISTO
// ----- TOKEN -----------------------------------------------------------------------------------------------
const registrarTokenSeguro = async (uid) => {
    try {
        await registrarTokenPush(uid);
    } catch (err) {
        console.warn('No se pudo registrar el token push:', err?.message);
    }
};
// ---------------------------------------------------------------------------------------------------------


// VISTO
// ----- CARRITO ------------------------------------------------------------------------------------------
export const suscribirseACarrito = (uid) => (dispatch) => {
    return suscribirseACarritoService(uid, (data) => {
        dispatch({
            type: ActionTypes.CARRITO_ACTUALIZAR,
            payload: data
        });
    });
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


export const cargarCarritoDesdeFirebase = (uid) => async (dispatch) => {
    try {
        console.log("Intentando cargar carrito para el usuario:", uid);
        const data = await cargarCarritoDesdeFirebaseService(uid);
        
        console.log("Datos recibidos del servicio:", data);

        // Verificamos si data es el array directamente o un objeto que contiene el array
        // Si tu servicio devuelve { items: [...] }, entonces debes usar data.items
        let itemsAEnviar = Array.isArray(data) ? data : (data?.items || []);
        
        console.log("Items finales a enviar al reducer:", itemsAEnviar);

        dispatch({ 
            type: ActionTypes.CARRITO_CARGAR, 
            payload: itemsAEnviar 
        });
        
    } catch (e) { 
        console.error("ERROR CRÍTICO en cargarCarritoDesdeFirebase:", e); 
    }
};


export const limpiarCarrito = () => async (dispatch, getState) => {
    dispatch({ type: ActionTypes.LIMPIAR_CARRITO });
    const { usuario } = getState();
    if (usuario?.user?.uid) await limpiarCarritoEnFirebaseService(usuario.user.uid);
};

// ----------------------------------------------------------------------------------------------------


// VISTO
// ---- FUNCION SIN MAS ---------------------------------------------------------------
const guardarEnFirebase = async (dispatch, getState) => {
    const { usuario, carrito } = getState();
    console.log("Intentando guardar en Firebase...", usuario?.user?.uid);
    
    if (usuario?.user?.uid) {
        try {
            const carritoRef = doc(db, "carritos", usuario.user.uid);
            await setDoc(carritoRef, {
                items: carrito.items || [],
                totalDescuento: carrito.totalDescuento || 0,
                // ...otros campos
            }, { merge: true });
            console.log("¡Carrito guardado con éxito!");
        } catch (error) {
            console.error("Error al guardar en Firebase:", error);
        }
    } else {
        console.warn("No se puede guardar: Usuario no definido");
    }
};
// ------------------------------------------------------------------------------------






// VISTO
// ---- CHAT ------------------------------------------------------------------------------------
export const suscribirseAMensajes = (ofertaId, callback) => (dispatch) => {
    dispatch({ type: ActionTypes.CHAT_LOADING }); 

    return suscribirseAMensajesService(ofertaId, (mensajes) => {
        dispatch({ type: ActionTypes.CHAT_ADD_MENSAJES, payload: mensajes });
        if (callback) callback(mensajes);
    });
};

export const enviarMensaje = (oferta, contenido, usuarioId) => async () => {
    try { await enviarMensajeService(oferta, contenido, usuarioId); }
    catch (error) { console.error(error); }
};
// --------------------------------------------------------------------------------------------



// -- AUTENTICACIÓN (LOGIN/REGISTRO) --
export const loginYRegistrarNotificaciones = (email, password) => async (dispatch) => {
    dispatch({ type: ActionTypes.LOGIN_LOADING });
    try {
        const usuario = await loginYRegistrarNotificacionesService(email, password);
        dispatch({ type: ActionTypes.LOGIN_SUCCESS, payload: usuario });
        dispatch(cargarCarritoDesdeFirebase(usuario.uid));
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

// VENTAS Y OFERTAS ----------------------------------------------------------------------------------------------
// --- SUSCRIPCIONES (Escucha en tiempo real de Firebase) ---

export const suscribirseAOfertasRecibidas = (uid) => (dispatch) => {
    return suscribirseAOfertasService(uid, (ofertas) => 
        dispatch({ type: ActionTypes.ADD_OFERTAS_RECIBIDAS, payload: ofertas })
    );
};

export const suscribirseAMisCompras = (uid) => (dispatch) => {
    // Ofertas enviadas por el usuario actual
    return suscribirseAMisComprasService(uid, (ofertas) => 
        dispatch({ type: ActionTypes.ADD_OFERTAS_ENVIADAS, payload: ofertas })
    );
};

export const suscribirseAVentas = (uid) => (dispatch) => {
    const qVentas = query(collection(db, "camisetas"), where("vendedorId", "==", uid));
    
    dispatch({ type: ActionTypes.VENTAS_LOADING }); 

    return onSnapshot(qVentas, (snapshot) => {
        const misVentas = snapshot.docs.map(d => ({
            id: d.id,
            ...serializarFirestore(d.data())
        }));
        dispatch({ type: ActionTypes.ADD_VENTAS, payload: misVentas });
    }, (error) => {
        dispatch({ type: ActionTypes.VENTAS_FAILED, payload: error.message });
    });
};

// --- ACCIONES DE MODIFICACIÓN (Escritura en base de datos) ---
export const gestionarOferta = (oferta, nuevoEstado) => async (dispatch) => {
    await gestionarOfertaService(oferta, nuevoEstado);
    dispatch({ type: ActionTypes.ACTUALIZAR_OFERTA, payload: { ...oferta, estado: nuevoEstado } });
    
    if (nuevoEstado === 'aceptada') {
        dispatch({ type: ActionTypes.ACTUALIZAR_CAMISETA, payload: { id: oferta.camisetaId, estadoVenta: 'vendida' } });
    }
};

export const enviarOferta = (datos) => async (dispatch) => {
    try {
        await addDoc(collection(db, "ofertas"), {
            camisetaId: datos.camisetaId,
            vendedorId: datos.vendedorId,
            compradorId: datos.compradorId,
            nombreComprador: datos.nombreComprador,
            monto: datos.monto,
            estado: 'pendiente',
            fecha: new Date().toISOString()
        });
    } catch (error) {
        console.error("Error al enviar oferta: ", error);
        throw error;
    }
};
// ---------------------------------------------------------------------------------------------------------------


// VISTO
// ---- LOGIN WITH GOOGLE ----------------------------------------------------------------------------------------
// FUNCION SIN MAS
const extractUser = (firebaseUser) => ({
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName ?? null,
    photoURL: firebaseUser.photoURL ?? null,
});

export const loginWithGoogle = () => async (dispatch) => {
    dispatch({ type: ActionTypes.AUTH_LOADING }); // ¡Añadido! Es vital avisar que estamos procesando
    
    try {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        const response = await GoogleSignin.signIn();
        const idToken = response?.data?.idToken ?? response?.idToken;
        const cred = await signInWithCredential(auth, GoogleAuthProvider.credential(idToken));
        const user = cred.user;
        
        const snapshot = await getDoc(doc(db, "usuarios", user.uid));
        if (!snapshot.exists()) {
            await setDoc(doc(db, "usuarios", user.uid), { uid: user.uid, email: user.email, favoritos: [], proveedor: 'google' });
        }
        
        dispatch({ type: ActionTypes.AUTH_SUCCESS, payload: extractUser(user) });
        dispatch(cargarCarritoDesdeFirebase(user.uid));
        await registrarTokenSeguro(user.uid);
    } catch (error) {
        dispatch({ type: ActionTypes.AUTH_FAILED, payload: error.message });
    }
};
// ------------------------------------------------------------------------------------------------------------------------


// VISTO
// ----- LOGOUT --------------------------------------------------------------------------------------------------------------
export const logout = () => async (dispatch) => {
    try {
        const user = await GoogleSignin.getCurrentUser();
        if (user) await GoogleSignin.signOut();
        await signOut(auth);

        dispatch({ type: ActionTypes.AUTH_LOGOUT }); // Usamos la constante definida
        dispatch({ type: ActionTypes.LIMPIAR_CARRITO }); 
    } catch (error) { 
        dispatch({ type: ActionTypes.AUTH_FAILED, payload: error.message });
    }
};

// RESTAURACION DE SESION
export const restoreSession = (firebaseUser) => (dispatch) => {
    if (firebaseUser) {
        dispatch({ type: ActionTypes.AUTH_SUCCESS, payload: extractUser(firebaseUser) });
        dispatch(cargarCarritoDesdeFirebase(firebaseUser.uid));
    } else {
        dispatch({ type: ActionTypes.AUTH_LOGOUT });
    }
};
// -----------------------------------------------------------------------------------------------------------------------------


// VISTO
// ----- CAMISETAS ------------------------------------------------------------------------------------------
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


export const suscribirseACamisetas = () => (dispatch) => {
    return onSnapshot(collection(db, "camisetas"), (snapshot) => {
        const camisetas = snapshot.docs.map(d => ({
            id: d.id,
            ...serializarFirestore(d.data()),
        }));
        dispatch({ type: ActionTypes.ADD_CAMISETAS, payload: camisetas });
    }, (error) => dispatch({ type: ActionTypes.CAMISETAS_FAILED, payload: error.message }));
};

export const addCamisetaAlStore = (camiseta) => ({
    type: 'ADD_CAMISETA',
    payload: camiseta
});
// --------------------------------------------------------------------------------------------------------------


// visto
// ----- CUPONES ----------------------------------------------------------------------------------------------------
export const suscribirseACupones = (uid) => (dispatch) => {
    return suscribirseACuponesService(uid, (cupones) => 
        dispatch({ type: ActionTypes.ADD_CUPONES, payload: cupones })
    );
};

// FUNCION SIN MAS
export const canjearCupon = (userId, codigo) => async (dispatch) => {
    let valorDescuento = 0;
    if (codigo.includes('FUTBOL10')) valorDescuento = 10;
    else if (codigo.includes('FUTBOL20')) valorDescuento = 20;
    else if (codigo.includes('FUTBOL40')) valorDescuento = 40;

    if (valorDescuento === 0) throw new Error('Código no reconocido');

    const cuponRef = doc(db, 'carritos', userId, 'historial_cupones', codigo);
    const carritoRef = doc(db, 'carritos', userId);

    await runTransaction(db, async (transaction) => {
        const cuponDoc = await transaction.get(cuponRef);
        if (cuponDoc.exists()) throw new Error('Este código ya ha sido escaneado');

        const carritoSnap = await transaction.get(carritoRef);
        const dataActual = carritoSnap.exists() ? carritoSnap.data() : { descuentosAplicados: {} };
        const nuevosDescuentos = { ...(dataActual.descuentosAplicados || {}), [codigo]: valorDescuento };
        const nuevoTotalDescuento = Object.values(nuevosDescuentos).reduce((a, b) => a + b, 0);

        transaction.set(cuponRef, { valor: valorDescuento, escaneado: true, canjeado: false, fecha: serverTimestamp() });
        transaction.set(carritoRef, { descuentosAplicados: nuevosDescuentos, totalDescuento: nuevoTotalDescuento }, { merge: true });
    });
    return { valor: valorDescuento };
};
// ----------------------------------------------------------------------------------------------------------------------------------