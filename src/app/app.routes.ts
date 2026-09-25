import { Routes } from '@angular/router';
import { Inicio } from './features/inicio/inicio';
import { Login } from './features/auth/login/login';
import { Registro } from './features/auth/registro/registro';
import { Catalogo } from './features/productos/catalogo/catalogo';


export const routes: Routes = [
  { path: '', component: Inicio, pathMatch: 'full' },
  { path: 'productos', component: Catalogo },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  { path: '**', redirectTo: '' }
];