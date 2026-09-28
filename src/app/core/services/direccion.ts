import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Direccion, DireccionRequest } from '../models/direccion.model';

@Injectable({
  providedIn: 'root'
})
export class DireccionService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/direcciones';

  listar(): Observable<Direccion[]> {
    return this.http.get<Direccion[]>(this.API_URL);
  }

  crear(request: DireccionRequest): Observable<Direccion> {
    return this.http.post<Direccion>(this.API_URL, request);
  }
}