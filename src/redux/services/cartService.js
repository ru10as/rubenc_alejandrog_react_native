import { doc, onSnapshot, getDoc, setDoc, collection, query, orderBy } from 'firebase/firestore';
import { db } from '../../api/firebaseConfig';

/**
 * Suscripción en tiempo real al documento del carrito del usuario.
 */
export const suscribirseACarritoService = (uid, callback) => {
    return onSnapshot(doc(db, "carritos", uid), (docSnapshot) => {
        if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            callback({
                totalDescuento: data.totalDescuento || 0,
                cuponesAplicados: Object.keys(data.descuentosAplicados || {})
            });
        } else {
            // Caso en que el usuario aún no tenga carrito creado
            callback({ totalDescuento: 0, cuponesAplicados: [] });
        }
    });
};

/**
 * Obtención única del carrito (sin suscripción).
 */
export const cargarCarritoDesdeFirebaseService = async (uid) => {
    const docRef = doc(db, "carritos", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data(); // Esto devuelve { items: [...], totalDescuento: ... }
    }
    return { items: [], totalDescuento: 0, cuponesAplicados: [] };
};

/**
 * Reseteo del carrito del usuario.
 */
export const limpiarCarritoEnFirebaseService = async (uid) => {
    try {
        await setDoc(doc(db, "carritos", uid), { 
            items: [],
            descuentosAplicados: {},
            totalDescuento: 0
        }, { merge: true });
    } catch (e) {
        console.error("Error al limpiar carrito en Firebase:", e);
        throw e;
    }
};

/**
 * Suscripción al historial de cupones de un usuario específico.
 */
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

export const suscribirseACuponesService = (userId, callback) => {
    const colRef = collection(db, 'carritos', userId, 'historial_cupones');
    return onSnapshot(colRef, (snapshot) => {
        const cupones = snapshot.docs.map(d => ({ 
            id: d.id, 
            ...serializarFirestore(d.data()) // <--- AQUÍ ESTÁ LA CORRECCIÓN
        }));
        console.log("LOG 1: Datos obtenidos en el servicio:", cupones);
        callback(cupones);
    });
};