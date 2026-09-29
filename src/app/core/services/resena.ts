import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Resena, ResenaRequest } from '../models/resena.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ResenaService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/resenas`;
  
  listarPorProducto(productoId: number): Observable<Resena[]> {
    return this.http.get<Resena[]>(`${this.API_URL}/producto/${productoId}`);
  }

  crear(request: ResenaRequest): Observable<Resena> {
    return this.http.post<Resena>(this.API_URL, request);
  }
}
