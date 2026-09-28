export interface Resena {
  id: number;
  usuarioId: number;
  usuarioNombre: string;
  calificacion: number;
  comentario: string | null;
  fecha: string;
}

export interface ResenaRequest {
  productoId: number;
  calificacion: number;
  comentario: string;
}