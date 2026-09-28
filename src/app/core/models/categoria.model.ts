export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string | null;
  categoriaPadreId: number | null;
}