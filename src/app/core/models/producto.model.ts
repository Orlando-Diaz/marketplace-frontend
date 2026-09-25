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
}

// Respuesta paginada de Spring Data
export interface PaginaProductos {
  content: Producto[];
  totalPages?: number;
  page?: { totalPages: number; number: number };
}