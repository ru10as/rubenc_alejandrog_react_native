import { configureStore } from '@reduxjs/toolkit';
import { camisetas } from './camisetas';     
import { comentarios } from './comentarios'; 
import { cabeceras } from './cabeceras';      
import { novedades } from './novedades';      
import { favoritos } from './favoritos';      
import { usuario } from './usuario';
import { carrito } from './carrito';
import { chat } from './chat';
import { cupones } from './cupones';
import { ventasYOfertas } from './ventasYOfertas';

export const ConfigureStore = () => {
    const store = configureStore({
        reducer: {
            camisetas: camisetas,
            comentarios: comentarios,
            cabeceras: cabeceras,
            novedades: novedades,
            favoritos: favoritos,
            usuario: usuario,
            carrito: carrito,
            ventasYOfertas: ventasYOfertas,
            chat: chat,
            cupones: cupones
        },
    });

    return store;
}