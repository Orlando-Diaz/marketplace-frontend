export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string | null;
  categoriaPadreId: number | null;
}

export interface CategoriaRequest {
  nombre: string;
  descripcion: string;
  categoriaPadreId: number | null;
}