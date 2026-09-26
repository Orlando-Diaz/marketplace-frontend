import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Carrito, ItemCarritoRequest } from '../models/carrito.model';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/carrito';

  obtener(): Observable<Carrito> {
    return this.http.get<Carrito>(this.API_URL);
  }

  agregar(request: ItemCarritoRequest): Observable<Carrito> {
    return this.http.post<Carrito>(`${this.API_URL}/items`, request);
  }

  quitar(itemId: number): Observable<Carrito> {
    return this.http.delete<Carrito>(`${this.API_URL}/items/${itemId}`);
  }
}