export interface Resena {
  id: number;
  usuarioId: number;
  usuarioNombre: string;
  calificacion: number;
  comentario: string | null;
  fecha: string;
}