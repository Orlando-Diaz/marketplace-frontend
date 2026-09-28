import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CheckoutRequest, Orden } from '../models/orden.model';

@Injectable({
  providedIn: 'root'
})
export class OrdenService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/ordenes';

  checkout(request: CheckoutRequest): Observable<Orden> {
    return this.http.post<Orden>(`${this.API_URL}/checkout`, request);
  }

  misOrdenes(): Observable<Orden[]> {
    return this.http.get<Orden[]>(this.API_URL);
  }
}