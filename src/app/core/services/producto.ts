import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FiltrosProductos, PaginaProductos, Producto, ProductoRequest } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/productos';

  listar(pagina: number, tamano: number, filtros: FiltrosProductos = {}): Observable<PaginaProductos> {
  let params = new HttpParams()
    .set('pagina', pagina)
    .set('tamano', tamano);

  // Solo mandamos los filtros que tienen un valor real
  for (const [clave, valor] of Object.entries(filtros)) {
    if (valor !== null && valor !== undefined && valor !== '' && valor !== 0 && valor !== false) {
      params = params.set(clave, String(valor));
    }
  }

  return this.http.get<PaginaProductos>(this.API_URL, { params });
}

  obtenerPorId(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.API_URL}/${id}`);
  }

  crear(request: ProductoRequest): Observable<Producto> {
    return this.http.post<Producto>(this.API_URL, request);
}
}