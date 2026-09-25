import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { ProductoService } from '../../../core/services/producto';
import { Producto } from '../../../core/models/producto.model'
import { ProductoCard } from '../../../shared/producto-card/producto-card';
;

@Component({
  selector: 'app-catalogo',
  imports: [ProductoCard],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css'
})
export class Catalogo implements OnInit {
  private productoService = inject(ProductoService);

  productos = signal<Producto[]>([]);
  pagina = signal(0);
  totalPaginas = signal(1);
  cargando = signal(false);
  error = signal<string | null>(null);

  private readonly TAMANO = 8;

  ngOnInit(): void {
    this.cargar(0);
  }

  cargar(pagina: number): void {
    this.cargando.set(true);
    this.error.set(null);

    this.productoService.listar(pagina, this.TAMANO).subscribe({
      next: (resp) => {
        this.productos.set(resp.content);
        this.totalPaginas.set(resp.page?.totalPages ?? resp.totalPages ?? 1);
        this.pagina.set(pagina);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el catálogo. ¿Está corriendo el backend?');
        this.cargando.set(false);
      }
    });
  }
}