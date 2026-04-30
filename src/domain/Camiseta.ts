export interface Camiseta {
  id: string;
  nombre: string;
  equipo: string;
  precio: number;
  imagenUrl: string;
  esDeUsuario: boolean; // Para distinguir stock oficial de Marketplace
}