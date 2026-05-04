import { configureStore } from '@reduxjs/toolkit';
// Cambiamos los nombres de los archivos importados para la tienda
import { camisetas } from './camisetas';     // Antes excursiones
import { comentarios } from './comentarios'; // Se mantiene
import { cabeceras } from './cabeceras';     // Se mantiene (o 'banners')
import { novedades } from './novedades';     // Antes actividades
import { favoritos } from './favoritos';     // Se mantiene (Wishlist)

export const ConfigureStore = () => {
    const store = configureStore({
        reducer: {
            camisetas: camisetas,
            comentarios: comentarios,
            cabeceras: cabeceras,
            novedades: novedades,
            favoritos: favoritos,
        },
    });

    return store;
}