import { Direccion } from './direccion.model';

export interface ItemOrden {
  productoId: number;
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Orden {
  id: number;
  estado: string;
  total: number;
  fecha: string;
  items: ItemOrden[];
  direccionEnvio: Direccion;
}

export interface CheckoutRequest {
  direccionEnvioId: number;
}