import { collection, query, where, orderBy, onSnapshot, updateDoc, doc, getDoc } from 'firebase/firestore';
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
 * Suscripción en tiempo real a las ofertas recibidas por un vendedor.
 */
export const suscribirseAOfertasService = (usuarioId, callback) => {
    const q = query(
        collection(db, 'ofertas'), 
        where('vendedorId', '==', usuarioId), 
        orderBy('fecha', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
        // APLICAMOS SERIALIZACIÓN AQUÍ
        const ofertas = snapshot.docs.map((d) => ({ 
            id: d.id, 
            ...serializarFirestore(d.data()) 
        }));
        callback(ofertas);
    });
};

export const suscribirseAMisComprasService = (usuarioId, callback) => {
    const q = query(
        collection(db, 'ofertas'), 
        where('compradorId', '==', usuarioId), 
        orderBy('fecha', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
        const ofertas = snapshot.docs.map((d) => ({ 
            id: d.id, 
            ...serializarFirestore(d.data()) 
        }));
        
        callback(ofertas);
    }, (error) => {
        console.error("Error en suscripción de 'Mis Compras':", error);
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