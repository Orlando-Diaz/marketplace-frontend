import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Categoria, CategoriaRequest } from '../models/categoria.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/categorias';

  listar(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.API_URL);
  }

  listarConEtiquetas(): Observable<{ id: number; etiqueta: string }[]> {
  return this.listar().pipe(
    map(lista => {
      const nombres = new Map(lista.map(c => [c.id, c.nombre]));
      return lista
        .map(c => ({
          id: c.id,
          etiqueta: c.categoriaPadreId ? `${nombres.get(c.categoriaPadreId)} › ${c.nombre}` : c.nombre
        }))
        .sort((a, b) => a.etiqueta.localeCompare(b.etiqueta));
    })
  );
}

crear(request: CategoriaRequest): Observable<Categoria> {
  return this.http.post<Categoria>(this.API_URL, request);
}

actualizar(id: number, request: CategoriaRequest): Observable<Categoria> {
  return this.http.put<Categoria>(`${this.API_URL}/${id}`, request);
}

eliminar(id: number): Observable<void> {
  return this.http.delete<void>(`${this.API_URL}/${id}`);
}
}