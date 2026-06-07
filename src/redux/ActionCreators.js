import * as ActionTypes from './ActionTypes';
import { db, auth } from '../api/firebaseConfig';
import { collection, getDocs, addDoc, doc, setDoc, getDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
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

// Para el registro de notificaciones de nuestra app / Registra el dispositivo del usuario
const registrarTokenSeguro = async (uid) => { // Recibimos el uid del usuario logueado
    try {
        await registrarTokenPush(uid);
    } catch (err) {
        console.warn('No se pudo registrar el token push:', err?.message);
    }
};

// --- COMENTARIOS ---
// descarga los comentarios desde Firebase, los convierte a un formato compatible con Redux y los 
// guarda en el estado global para su visualizacion, gestionando cualquier error de conexion para evitar que la aplicacion falle.
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

// Funciones simples que generan los mensajes necesarios de redux (para la actualizacion del estado)
export const comentariosFailed = (errmess) => ({ type: ActionTypes.COMENTARIOS_FAILED, payload: errmess });
export const addComentarios = (comentarios) => ({ type: ActionTypes.ADD_COMENTARIOS, payload: comentarios });


// serializarFirestore transforma datos complejos de Firebase, como fechas, en formatos simples 
// y estandar para que puedan almacenarse en Redux sin causar errores de compatibilidad.
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
// fetchCamisetas descarga los productos desde Firebase y los guarda en Redux, marcando el inicio de 
// la carga, limpiando los datos y gestionando posibles errores de conexion automaticamente.
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

// Acciones de Redux necesarias para gestionar el estado de la carga: camisetasLoading indica que la descarga ha comenzado, 
// addCamisetas almacena los productos obtenidos tras el exito y camisetasFailed guarda el mensaje de error si ocurre algun problema.
export const camisetasLoading = () => ({ type: ActionTypes.CAMISETAS_LOADING });
export const camisetasFailed = (errmess) => ({ type: ActionTypes.CAMISETAS_FAILED, payload: errmess });
export const addCamisetas = (camisetas) => ({ type: ActionTypes.ADD_CAMISETAS, payload: camisetas });


// --- CABECERAS ---
// fetchCabeceras descarga los elementos de cabecera desde Firebase, gestionando el estado de carga, 
// la limpieza de datos y posibles errores para mantener la interfaz actualizada en Redux.
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

// Para gestionar el estado de carga de las cabeceras: cabecerasLoading indica el inicio de la operacion, addCabeceras 
// guarda los datos recibidos y cabecerasFailed captura cualquier error ocurrido durante el proceso.
export const cabecerasLoading = () => ({ type: ActionTypes.CABECERAS_LOADING });
export const cabecerasFailed = (errmess) => ({ type: ActionTypes.CABECERAS_FAILED, payload: errmess });
export const addCabeceras = (cabeceras) => ({ type: ActionTypes.ADD_CABECERAS, payload: cabeceras });


// --- NOVEDADES ---
// fetchNovedades descarga la lista de novedades desde Firebase, gestionando el estado de carga, 
// la limpieza de datos y la captura de errores para actualizar el estado global de Redux.
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

// Acciones para gestionar la carga de las novedades: novedadesLoading señala el inicio del proceso, 
// addNovedades almacena los datos obtenidos y novedadesFailed reporta cualquier error ocurrido.
export const novedadesLoading = () => ({ type: ActionTypes.NOVEDADES_LOADING });
export const novedadesFailed = (errmess) => ({ type: ActionTypes.NOVEDADES_FAILED, payload: errmess });
export const addNovedades = (novedades) => ({ type: ActionTypes.ADD_NOVEDADES, payload: novedades });


// --- FAVORITOS Y POSTS ---
// postFavorito guarda un nuevo registro en la coleccion "favoritos" de Firebase vinculando un usuario y una 
// camiseta con su fecha actual, y luego actualiza el estado de Redux para reflejar este cambio.
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

// Esta crea la accion de Redux para añadir una camiseta especifica a la lista de favoritos en el estado global.
export const addFavorito = (camisetaId) => ({ type: ActionTypes.ADD_FAVORITO, payload: camisetaId });

// postComentario crea un nuevo objeto con los detalles de la valoracion, lo guarda en la coleccion "comentarios" de 
// Firebase y actualiza instantaneamente el estado de Redux para incluir el nuevo comentario.
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

// Crea la accion de Redux para añadir un nuevo comentario al estado global, permitiendo que la interfaz 
// se actualice inmediatamente tras su publicacion.
export const addComentario = (comentario) => ({ type: ActionTypes.ADD_COMENTARIO, payload: comentario });

// extractUser limpia el objeto de usuario de Firebase, seleccionando solo los campos necesarios 
// (uid, email, displayName, photoURL) y normalizando los valores ausentes a null.
const extractUser = (firebaseUser) => ({
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName ?? null,
    photoURL: firebaseUser.photoURL ?? null,
});

// ACCION PARA REGISTRO MANUAL
// signUp gestiona el registro de un nuevo usuario en Firebase, guarda su perfil en la base de datos, 
// inicializa su estado de sesion en Redux y registra su token de seguridad.
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
            .catch(e => console.log("Error en DB (pero el usuario ya entro):", e));
        await registrarTokenSeguro(user.uid);
    } catch (error) {
        Alert.alert("Error en Registro", error.message);
    }
};

// ACCION PARA LOGIN MANUAL
// login autentica al usuario en Firebase, actualiza su sesion en Redux usando extractUser, registra su 
// token de seguridad y carga automaticamente su carrito desde la base de datos.
export const login = (email, password) => async (dispatch) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    dispatch({ type: ActionTypes.LOGIN_SUCCESS, payload: extractUser(userCredential.user) });
    await registrarTokenSeguro(userCredential.user.uid);
    dispatch(cargarCarritoDesdeFirebase(userCredential.user.uid));
};


// ACCION PARA LOGIN CON GOOGLE (nativo + Firebase)
// loginWithGoogle maneja la autenticacion mediante Google, crea un perfil en la base de datos si el usuario es nuevo, 
// actualiza el estado de Redux y sincroniza tanto el carrito como el token de seguridad del usuario.
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

// restoreSession recupera la sesion activa al iniciar la app: si existe un usuario, actualiza el estado de Redux 
// y carga su carrito; de lo contrario, cierra la sesion.
export const restoreSession = (firebaseUser) => (dispatch) => {
    if (firebaseUser) {
        dispatch({ type: ActionTypes.LOGIN_SUCCESS, payload: extractUser(firebaseUser) });
        dispatch(cargarCarritoDesdeFirebase(firebaseUser.uid));
    } else {
        dispatch({ type: ActionTypes.LOGOUT_SUCCESS });
    }
};

// --- LOGOUT ---
// logout cierra la sesion del usuario tanto en Google como en Firebase, y actualiza el estado de Redux 
// para limpiar los datos del usuario.
export const logout = () => async (dispatch) => {
    try {
        try {
            const isSignedIn = await GoogleSignin.getCurrentUser();
            if (isSignedIn) {
                await GoogleSignin.signOut();
            }
        } catch (gErr) {
            console.warn("GoogleSignin.signOut fallo (continua):", gErr?.message);
        }
        await signOut(auth);
        dispatch({ type: ActionTypes.LOGOUT_SUCCESS });
    } catch (error) {
        console.error("Error al cerrar sesion:", error.message);
    }
};

// Exporta los codigos de error de Google Sign-in con un alias mas claro para usarlos en el manejo 
// de excepciones de la autenticacion.
export { statusCodes as googleStatusCodes };

// Sincroniza el estado actual del carrito en Redux con la base de datos de Firebase, 
// siempre que haya un usuario autenticado.
const guardarEnFirebase = async (dispatch, getState) => {
    const { usuario, carrito } = getState();
    if (usuario?.user?.uid) {
        try {
            // Guardamos solo los items, manteniendo intactos los otros campos del documento 
            // como descuentosAplicados y totalDescuento.
            await setDoc(doc(db, "carritos", usuario.user.uid), { 
                items: carrito.items 
            }, { merge: true });
        } catch (e) { 
            console.error("Error sincronizando carrito:", e); 
        }
    }
};

// anadirAlCarrito actualiza el estado de Redux con una nueva camiseta y su talla, y luego 
// activa automaticamente la sincronizacion del carrito con Firebase.
export const anadirAlCarrito = (camiseta, talla) => async (dispatch, getState) => {
    dispatch({ type: ActionTypes.ANADIR_CARRITO, payload: { camiseta, talla } });
    guardarEnFirebase(dispatch, getState);
};

// restarDelCarrito reduce la cantidad o elimina un item del carrito en Redux y sincroniza 
// inmediatamente el cambio con la base de datos de Firebase.
export const restarDelCarrito = (id, talla) => async (dispatch, getState) => {
    dispatch({ type: ActionTypes.RESTAR_CARRITO, payload: { id, talla } });
    guardarEnFirebase(dispatch, getState);
};

// eliminarDelCarrito borra un producto especifico (identificado por ID y talla) del estado de Redux 
// y sincroniza ese cambio con la base de datos en Firebase.
export const eliminarDelCarrito = (id, talla) => async (dispatch, getState) => {
    dispatch({ type: ActionTypes.ELIMINAR_CARRITO, payload: { id, talla } });
    guardarEnFirebase(dispatch, getState);
};

// limpiarCarrito vacia el estado del carrito en Redux y, si el usuario esta autenticado, 
// borra tambien sus articulos del carrito guardado en Firebase.
export const limpiarCarrito = () => async (dispatch, getState) => {
    // 1. Primero limpiamos Redux para una respuesta visual inmediata
    dispatch({ type: ActionTypes.LIMPIAR_CARRITO });
    
    const { usuario } = getState();
    if (usuario?.user?.uid) {
        try {
            // 2. Reseteamos el documento de Firestore
            // Usamos un objeto completo para asegurar que no queden valores antiguos
            await setDoc(doc(db, "carritos", usuario.user.uid), { 
                items: [],
                descuentosAplicados: {},
                totalDescuento: 0
            }, { merge: true }); // Merge asegura que si hay otros campos, no se borren
        } catch (e) {
            console.error("Error al limpiar carrito en Firebase:", e);
        }
    }
};

// cargarCarritoDesdeFirebase obtiene los articulos guardados del usuario en Firebase y los carga en el estado de Redux.
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

//
export const actualizarCamisetaEnStore = (camisetaId, datosActualizados) => ({
    type: 'UPDATE_CAMISETA', // O el nombre que tenga tu acción en el reducer
    payload: {
        id: camisetaId,
        ...datosActualizados
    }
});

export const addCamisetaAlStore = (camiseta) => ({
    type: 'ADD_CAMISETA',
    payload: camiseta
});

export const suscribirseACamisetas = () => (dispatch) => {
    const unsubscribe = onSnapshot(collection(db, "camisetas"), (snapshot) => {
        const camisetas = snapshot.docs.map(doc => ({
            id: doc.id,
            ...serializarFirestore(doc.data()),
        }));
        dispatch(addCamisetas(camisetas));
    }, (error) => {
        dispatch(camisetasFailed(error.message));
    });

    return unsubscribe;
};

///
export const enviarMensaje = (oferta, contenido, usuarioId) => async (dispatch) => {
    try {
        // 1. Actualizamos el "sobre" (la metadata del chat)
        await setDoc(doc(db, 'chats', oferta.id), {
            participantes: [oferta.compradorId, oferta.vendedorId],
            compradorId: oferta.compradorId,
            compradorNombre: oferta.nombreComprador,
            vendedorId: oferta.vendedorId,
            camisetaId: oferta.camisetaId,
            ultimoMensaje: contenido,
            ultimoAutorId: usuarioId,
            ultimaFecha: serverTimestamp(),
        }, { merge: true });

        // 2. Registramos el mensaje dentro de la subcolección
        await addDoc(collection(db, 'chats', oferta.id, 'mensajes'), {
            texto: contenido,
            autorId: usuarioId,
            fecha: serverTimestamp(),
        });

    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        // Si tienes algún tipo de notificación de error en Redux, podrías dispararlo aquí
    }
};