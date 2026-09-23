export interface AuthResponse {
  token: string;
  email: string;
  nombre: string;
  rol: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegistroRequest {
  nombre: string;
  email: string;
  password: string;
  telefono: string;
}