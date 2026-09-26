import { Routes } from '@angular/router';
import { Inicio } from './features/inicio/inicio';
import { Login } from './features/auth/login/login';
import { Registro } from './features/auth/registro/registro';
import { Catalogo } from './features/productos/catalogo/catalogo';
import { DetalleProducto } from './features/productos/detalle-producto/detalle-producto';
import { CarritoPage } from './features/carrito/carrito-page/carrito-page';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: '', component: Inicio, pathMatch: 'full' },
  { path: 'productos', component: Catalogo },
  { path: 'productos/:id', component: DetalleProducto },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  { path: 'carrito', component: CarritoPage, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];