import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CheckoutRequest, Orden } from '../models/orden.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrdenService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/ordenes`;
  
  checkout(request: CheckoutRequest): Observable<Orden> {
    return this.http.post<Orden>(`${this.API_URL}/checkout`, request);
  }

  misOrdenes(): Observable<Orden[]> {
    return this.http.get<Orden[]>(this.API_URL);
  }
}
