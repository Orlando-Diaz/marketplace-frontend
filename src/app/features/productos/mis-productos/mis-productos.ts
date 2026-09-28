import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductoService } from '../../../core/services/producto';
import { Producto } from '../../../core/models/producto.model';

@Component({
  selector: 'app-mis-productos',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './mis-productos.html',
  styleUrl: './mis-productos.css'
})
export class MisProductos implements OnInit {
  private productoService = inject(ProductoService);

  productos = signal<Producto[]>([]);
  cargando = signal(true);
  error = signal<string | null>(null);
  cambiandoId = signal<number | null>(null);

  ngOnInit(): void {
    this.productoService.misProductos().subscribe({
      next: (lista) => {
        this.productos.set([...lista].sort((a, b) => b.fechaPublicacion.localeCompare(a.fechaPublicacion)));
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar tus productos.');
        this.cargando.set(false);
      }
    });
  }

  alternarEstado(p: Producto): void {
    const activar = p.estado !== 'DISPONIBLE';
    this.cambiandoId.set(p.id);

    this.productoService.cambiarEstado(p.id, activar).subscribe({
      next: (actualizado) => {
        this.productos.update(lista => lista.map(x => x.id === actualizado.id ? actualizado : x));
        this.cambiandoId.set(null);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'No se pudo cambiar el estado.');
        this.cambiandoId.set(null);
      }
    });
  }
}