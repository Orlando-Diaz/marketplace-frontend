import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Resena } from '../models/resena.model';

@Injectable({
  providedIn: 'root'
})
export class ResenaService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/resenas';

  listarPorProducto(productoId: number): Observable<Resena[]> {
    return this.http.get<Resena[]>(`${this.API_URL}/producto/${productoId}`);
  }
}