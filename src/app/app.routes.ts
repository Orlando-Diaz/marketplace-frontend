import { Routes } from '@angular/router';
import { Inicio } from './features/inicio/inicio';
import { Login } from './features/auth/login/login';
import { Registro } from './features/auth/registro/registro';
import { Catalogo } from './features/productos/catalogo/catalogo';
import { PublicarProducto } from './features/productos/publicar-producto/publicar-producto';
import { DetalleProducto } from './features/productos/detalle-producto/detalle-producto';
import { CarritoPage } from './features/carrito/carrito-page/carrito-page';
import { CheckoutPage } from './features/checkout/checkout-page/checkout-page';
import { MisOrdenes } from './features/ordenes/mis-ordenes/mis-ordenes';
import { authGuard } from './core/guards/auth-guard';
import { AdminCategorias } from './features/admin/admin-categorias/admin-categorias';
import { adminGuard } from './core/guards/admin-guard';
import { MisProductos } from './features/productos/mis-productos/mis-productos';

export const routes: Routes = [
  { path: '', component: Inicio, pathMatch: 'full' },
  { path: 'productos', component: Catalogo },
  { path: 'productos/publicar', component: PublicarProducto, canActivate: [authGuard] },
  { path: 'productos/:id', component: DetalleProducto },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  { path: 'carrito', component: CarritoPage, canActivate: [authGuard] },
  { path: 'checkout', component: CheckoutPage, canActivate: [authGuard] },
  { path: 'ordenes', component: MisOrdenes, canActivate: [authGuard] },
  { path: 'admin/categorias', component: AdminCategorias, canActivate: [adminGuard] },
  { path: 'productos/:id/editar', component: PublicarProducto, canActivate: [authGuard] },
  { path: 'mis-productos', component: MisProductos, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
