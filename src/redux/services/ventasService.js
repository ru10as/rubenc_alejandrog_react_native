import { collection, query, where, orderBy, onSnapshot, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../../api/firebaseConfig';

/**
 * Suscripción en tiempo real a las ofertas recibidas por un vendedor.
 */
export const suscribirseAOfertasService = (usuarioId, callback) => {
    const q = query(
        collection(db, 'ofertas'), 
        where('vendedorId', '==', usuarioId), 
        orderBy('fecha', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
        const ofertas = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        callback(ofertas);
    });
};

/**
 * Gestión de estado de una oferta (Aceptar/Rechazar).
 */
export const gestionarOfertaService = async (oferta, nuevoEstado) => {
    const ofertaRef = doc(db, 'ofertas', oferta.id);
    
    // Actualizamos el estado de la oferta
    await updateDoc(ofertaRef, {
        estado: nuevoEstado
    });

    // Si se acepta, podrías añadir aquí lógica extra, como marcar la camiseta como vendida
    if (nuevoEstado === 'aceptada') {
        const camisetaRef = doc(db, 'camisetas', oferta.camisetaId);
        await updateDoc(camisetaRef, {
            estadoVenta: 'vendida'
        });
    }
};