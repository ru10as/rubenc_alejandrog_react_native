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
    try {
        const docSnap = await getDoc(doc(db, "carritos", uid));
        if (docSnap.exists()) {
            return docSnap.data().items || [];
        }
        return null;
    } catch (e) {
        console.error("Error cargando carrito desde Firebase:", e);
        throw e;
    }
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
export const suscribirseACuponesService = (userId, callback) => {
    const colRef = collection(db, 'carritos', userId, 'historial_cupones');
    return onSnapshot(colRef, (snapshot) => {
        const cupones = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        callback(cupones);
    });
};