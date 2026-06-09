import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut 
} from 'firebase/auth';
import { auth } from '../../api/firebaseConfig';
import { registrarTokenPush } from '../../comun/notificaciones';

/**
 * Servicio para el Login del usuario.
 */
export const loginYRegistrarNotificacionesService = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await registrarTokenPush(user.uid);
    return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || null,
    };
};

/**
 * Servicio para el Registro de un nuevo usuario.
 */
export const registrarUsuarioYNotificacionesService = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await registrarTokenPush(user.uid);

    return { 
        uid: user.uid, 
        email: user.email 
    };
};

/**
 * Servicio para cerrar sesión.
 */
export const logoutService = async () => {
    await signOut(auth);
};