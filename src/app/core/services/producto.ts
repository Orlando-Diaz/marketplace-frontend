import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginaProductos, Producto } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/productos';

  listar(pagina: number, tamano: number): Observable<PaginaProductos> {
    const params = new HttpParams()
      .set('pagina', pagina)
      .set('tamano', tamano);
    return this.http.get<PaginaProductos>(this.API_URL, { params });
  }

  obtenerPorId(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.API_URL}/${id}`);
  }
}