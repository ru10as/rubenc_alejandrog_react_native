import { configureStore } from '@reduxjs/toolkit';
import { camisetas } from './camisetas';     
import { comentarios } from './comentarios'; 
import { cabeceras } from './cabeceras';      
import { novedades } from './novedades';      
import { favoritos } from './favoritos';      
import { usuario } from './usuario';
import { carrito } from './carrito';

export const ConfigureStore = () => {
    const store = configureStore({
        reducer: {
            camisetas: camisetas,
            comentarios: comentarios,
            cabeceras: cabeceras,
            novedades: novedades,
            favoritos: favoritos,
            usuario: usuario,
            carrito:carrito,
        },
    });

    return store;
}