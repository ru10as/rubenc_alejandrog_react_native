import { db } from './firebaseConfig';
import { collection, doc, setDoc } from 'firebase/firestore';
import datos from './db.json'; 

export const importarDatos = async () => {
    try {
        console.log("Iniciando importación masiva a Cloud Firestore...");
       
        // 1. Importar Camisetas
        for (const item of datos.camisetas) {
            await setDoc(doc(db, "camisetas", item.id.toString()), item);
        }

        // 2. Importar Comentarios
        for (const comentario of datos.comentarios) {
            await setDoc(doc(db, "comentarios", comentario.id.toString()), comentario);
        }

        // 3. Importar Cabeceras
        for (const cabecera of datos.cabeceras) {
            await setDoc(doc(db, "cabeceras", cabecera.id.toString()), cabecera);
        }

        // 4. Importar Novedades
        for (const novedad of datos.novedades) {
            await setDoc(doc(db, "novedades", novedad.id.toString()), novedad);
        }

        console.log("¡Todo importado correctamente!");
        alert("Base de datos sincronizada con éxito");
    } catch (error) {
        console.error("Error al importar:", error);
        alert("Hubo un error al sincronizar: " + error.message);
    }
};