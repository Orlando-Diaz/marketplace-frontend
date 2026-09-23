import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegistroRequest } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api/auth';
  private readonly TOKEN_KEY = 'marketplace_token';

  usuarioActual = signal<AuthResponse | null>(this.cargarUsuarioGuardado());

  constructor(private http: HttpClient) {}

  registrar(request: RegistroRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/registro`, request)
      .pipe(tap(response => this.guardarSesion(response)));
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, request)
      .pipe(tap(response => this.guardarSesion(response)));
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.usuarioActual.set(null);
  }

  obtenerToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  estaAutenticado(): boolean {
    return this.obtenerToken() !== null;
  }

  private guardarSesion(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, JSON.stringify(response));
    this.usuarioActual.set(response);
  }

  private cargarUsuarioGuardado(): AuthResponse | null {
    const datos = localStorage.getItem(this.TOKEN_KEY);
    return datos ? JSON.parse(datos) : null;
  }
}