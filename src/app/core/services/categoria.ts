import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../models/categoria.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/categorias';

  listar(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.API_URL);
  }
}