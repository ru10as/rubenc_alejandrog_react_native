import { configureStore } from '@reduxjs/toolkit';
import { camisetas } from './camisetas';
import { comentarios } from './comentarios';
import { cabeceras } from './cabeceras';
import { novedades } from './novedades';
import { favoritos } from './favoritos';

export const ConfigureStore = () => {
    const store = configureStore({
        reducer: {
            camisetas,
            comentarios,
            cabeceras,
            novedades,
            favoritos,
        },
    });
    return store;
};
