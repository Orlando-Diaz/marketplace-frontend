export interface Direccion {
  id: number;
  calle: string;
  ciudad: string;
  departamento: string;
  codigoPostal: string | null;
  esPrincipal: boolean;
}

export interface DireccionRequest {
  calle: string;
  ciudad: string;
  departamento: string;
  codigoPostal: string;
  esPrincipal: boolean;
}