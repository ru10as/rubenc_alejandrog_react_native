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
    // 1. Autenticación con Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2. Registro del token para recibir notificaciones (Push)
    await registrarTokenPush(user.uid);

    // 3. Retorno de datos limpios para el Reducer
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
    // 1. Creación del usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2. Registro del token asociado al nuevo UID
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
    // Aquí puedes añadir lógica extra si necesitas limpiar algo más en el dispositivo
    await signOut(auth);
};