import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CarritoService } from '../../../core/services/carrito';
import { DireccionService } from '../../../core/services/direccion';
import { OrdenService } from '../../../core/services/orden';
import { Carrito } from '../../../core/models/carrito.model';
import { Direccion } from '../../../core/models/direccion.model';

@Component({
  selector: 'app-checkout-page',
  imports: [CurrencyPipe, ReactiveFormsModule, RouterLink],
  templateUrl: './checkout-page.html',
  styleUrl: './checkout-page.css'
})
export class CheckoutPage implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private carritoService = inject(CarritoService);
  private direccionService = inject(DireccionService);
  private ordenService = inject(OrdenService);

  carrito = signal<Carrito | null>(null);
  direcciones = signal<Direccion[]>([]);
  direccionSeleccionada = signal<number | null>(null);
  mostrarFormulario = signal(false);

  cargando = signal(true);
  guardandoDireccion = signal(false);
  procesando = signal(false);
  error = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    calle: ['', Validators.required],
    ciudad: ['', Validators.required],
    departamento: ['', Validators.required],
    codigoPostal: [''],
    esPrincipal: [false]
  });

  ngOnInit(): void {
    // Pedimos carrito y direcciones al mismo tiempo, y esperamos a que lleguen ambos
    forkJoin({
      carrito: this.carritoService.obtener(),
      direcciones: this.direccionService.listar()
    }).subscribe({
      next: ({ carrito, direcciones }) => {
        if (carrito.items.length === 0) {
          this.router.navigate(['/carrito']);
          return;
        }

        this.carrito.set(carrito);
        this.direcciones.set(direcciones);

        const principal = direcciones.find(d => d.esPrincipal) ?? direcciones[0];
        this.direccionSeleccionada.set(principal?.id ?? null);
        this.mostrarFormulario.set(direcciones.length === 0);

        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la información del checkout.');
        this.cargando.set(false);
      }
    });
  }

  guardarDireccion(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardandoDireccion.set(true);

    this.direccionService.crear(this.form.getRawValue()).subscribe({
      next: (nueva) => {
        this.direcciones.update(lista => [...lista, nueva]);
        this.direccionSeleccionada.set(nueva.id);
        this.mostrarFormulario.set(false);
        this.form.reset();
        this.guardandoDireccion.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'No se pudo guardar la dirección.');
        this.guardandoDireccion.set(false);
      }
    });
  }

  confirmarCompra(): void {
    const direccionId = this.direccionSeleccionada();
    if (!direccionId) return;

    this.procesando.set(true);
    this.error.set(null);

    this.ordenService.checkout({ direccionEnvioId: direccionId }).subscribe({
      next: (orden) => {
        this.router.navigate(['/ordenes'], { queryParams: { nueva: orden.id } });
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'No se pudo completar la compra.');
        this.procesando.set(false);
      }
    });
  }
}