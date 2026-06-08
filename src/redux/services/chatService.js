import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, setDoc, doc } from 'firebase/firestore';
import { db } from '../../api/firebaseConfig';

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

/**
 * Suscripción en tiempo real a los mensajes de un chat específico.
 */
export const suscribirseAMensajesService = (ofertaId, callback) => {
    const q = query(collection(db, 'chats', ofertaId, 'mensajes'), orderBy('fecha', 'asc'));
    
    return onSnapshot(q, (snapshot) => {
        // El servicio entrega los datos listos para Redux
        const mensajes = snapshot.docs.map(d => ({ 
            id: d.id, 
            ...serializarFirestore(d.data()) 
        }));
        callback(mensajes);
    });
};

/**
 * Envío de un nuevo mensaje y actualización del resumen del chat.
 */
export const enviarMensajeService = async (oferta, contenido, autorId) => {
    // 1. Actualizamos el resumen del chat (merge: true es vital aquí)
    await setDoc(doc(db, 'chats', oferta.id), {
        participantes: [oferta.compradorId, oferta.vendedorId],
        compradorId: oferta.compradorId,
        compradorNombre: oferta.nombreComprador,
        vendedorId: oferta.vendedorId,
        camisetaId: oferta.camisetaId,
        ultimoMensaje: contenido,
        ultimoAutorId: autorId,
        ultimaFecha: serverTimestamp(),
    }, { merge: true });

    // 2. Añadimos el mensaje a la subcolección
    await addDoc(collection(db, 'chats', oferta.id, 'mensajes'), {
        texto: contenido,
        autorId: autorId,
        fecha: serverTimestamp(),
    });
};