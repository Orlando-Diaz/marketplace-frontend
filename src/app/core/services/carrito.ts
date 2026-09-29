import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Carrito, ItemCarritoRequest } from '../models/carrito.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/carrito`;

  obtener(): Observable<Carrito> {
    return this.http.get<Carrito>(this.API_URL);
  }

  agregar(request: ItemCarritoRequest): Observable<Carrito> {
    return this.http.post<Carrito>(`${this.API_URL}/items`, request);
  }

  quitar(itemId: number): Observable<Carrito> {
    return this.http.delete<Carrito>(`${this.API_URL}/items/${itemId}`);
  }

  actualizarCantidad(itemId: number, cantidad: number): Observable<Carrito> {
    return this.http.put<Carrito>(`${this.API_URL}/items/${itemId}`, { cantidad });
  }
}
