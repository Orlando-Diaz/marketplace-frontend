export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  estado: string;
  fechaPublicacion: string;
  usuarioId: number;
  usuarioNombre: string;
  categoriaId: number;
  categoriaNombre: string;
  calificacionPromedio: number | null;
  totalResenas: number;
  imagenes: string[];
}

// Respuesta paginada de Spring Data
export interface PaginaProductos {
  content: Producto[];
  totalPages?: number;
  totalElements?: number;
  page?: { totalPages: number; totalElements: number; number: number };
}

export interface FiltrosProductos {
  q?: string;
  categoriaId?: number;
  precioMin?: number | null;
  precioMax?: number | null;
  soloDisponibles?: boolean;
  orden?: string;
}

export interface ProductoRequest {
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoriaId: number;
  imagenes: string[];
}