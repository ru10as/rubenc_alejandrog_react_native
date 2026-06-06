export const baseUrl = "http://172.20.10.2:3001/";
export const colorTiendaOscuro = '#0D1B2A';
export const colorTiendaClaro = '#E0E1DD';
export const colorTiendaAcento = '#FB8500';

// Una camiseta es de "segunda mano" si la publicó un usuario (tiene creadoPor).
// Si no tiene creadoPor, la pusimos nosotros => es "tienda oficial".
export const esProductoSegundaMano = (item) => !!item?.creadoPor;
