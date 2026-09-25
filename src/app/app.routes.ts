import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Registro } from './features/auth/registro/registro';
import { Catalogo } from './features/productos/catalogo/catalogo';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'productos', component: Catalogo },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro }
];