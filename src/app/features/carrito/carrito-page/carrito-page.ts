import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CarritoService } from '../../../core/services/carrito';
import { Carrito } from '../../../core/models/carrito.model';

@Component({
  selector: 'app-carrito-page',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './carrito-page.html',
  styleUrl: './carrito-page.css'
})
export class CarritoPage implements OnInit {
  private carritoService = inject(CarritoService);

  carrito = signal<Carrito | null>(null);
  cargando = signal(true);
  error = signal<string | null>(null);
  quitandoId = signal<number | null>(null);

  ngOnInit(): void {
    this.carritoService.obtener().subscribe({
      next: (c) => {
        this.carrito.set(c);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar tu carrito.');
        this.cargando.set(false);
      }
    });
  }

  quitar(itemId: number): void {
    this.quitandoId.set(itemId);

    this.carritoService.quitar(itemId).subscribe({
      next: (c) => {
        this.carrito.set(c);
        this.quitandoId.set(null);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'No se pudo quitar el producto.');
        this.quitandoId.set(null);
      }
    });
  }
}