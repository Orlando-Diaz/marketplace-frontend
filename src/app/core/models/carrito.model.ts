export interface ItemCarrito {
  id: number;
  productoId: number;
  productoNombre: string;
  productoPrecio: number;
  cantidad: number;
  subtotal: number;
  productoStock: number;
}

export interface Carrito {
  id: number;
  items: ItemCarrito[];
  total: number;
}

export interface ItemCarritoRequest {
  productoId: number;
  cantidad: number;
}