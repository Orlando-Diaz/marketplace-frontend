import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductoService } from '../../../core/services/producto';
import { ResenaService } from '../../../core/services/resena';
import { CarritoService } from '../../../core/services/carrito';
import { AuthService } from '../../../core/services/auth';
import { Producto } from '../../../core/models/producto.model';
import { Resena } from '../../../core/models/resena.model';

@Component({
  selector: 'app-detalle-producto',
  imports: [RouterLink, CurrencyPipe, DatePipe, DecimalPipe],
  templateUrl: './detalle-producto.html',
  styleUrl: './detalle-producto.css'
})
export class DetalleProducto implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productoService = inject(ProductoService);
  private resenaService = inject(ResenaService);
  private carritoService = inject(CarritoService);
  private authService = inject(AuthService);

  producto = signal<Producto | null>(null);
  resenas = signal<Resena[]>([]);
  cantidad = signal(1);
  imagenActiva = signal(0);

  cargando = signal(true);
  error = signal<string | null>(null);

  agregando = signal(false);
  mensajeCarrito = signal<string | null>(null);
  errorCarrito = signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.productoService.obtenerPorId(id).subscribe({
      next: (p) => {
        this.producto.set(p);
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(err.status === 404 ? 'Este producto no existe.' : 'No se pudo cargar el producto.');
        this.cargando.set(false);
      }
    });

    this.resenaService.listarPorProducto(id).subscribe({
      next: (r) => this.resenas.set(r)
    });
  }

  cambiarCantidad(delta: number): void {
    const stock = this.producto()?.stock ?? 1;
    const nueva = this.cantidad() + delta;
    if (nueva >= 1 && nueva <= stock) {
      this.cantidad.set(nueva);
    }
  }

  agregarAlCarrito(): void {
    // Sin sesión, lo mandamos a iniciar sesión primero
    if (!this.authService.usuarioActual()) {
      this.router.navigate(['/login']);
      return;
    }

    const p = this.producto();
    if (!p) return;

    this.agregando.set(true);
    this.mensajeCarrito.set(null);
    this.errorCarrito.set(null);

    this.carritoService.agregar({ productoId: p.id, cantidad: this.cantidad() }).subscribe({
      next: () => {
        this.agregando.set(false);
        this.mensajeCarrito.set(`Agregaste ${this.cantidad()} al carrito`);
      },
      error: (err) => {
        this.agregando.set(false);
        this.errorCarrito.set(err.error?.message ?? 'No se pudo agregar al carrito');
      }
    });
  }

  estrellas(calificacion: number): string {
    return '★'.repeat(calificacion) + '☆'.repeat(5 - calificacion);
  }
}