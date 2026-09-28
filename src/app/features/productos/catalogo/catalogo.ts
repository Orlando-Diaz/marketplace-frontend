import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';
import { ProductoService } from '../../../core/services/producto';
import { CategoriaService } from '../../../core/services/categoria';
import { Producto } from '../../../core/models/producto.model';
import { ProductoCard } from '../../../shared/producto-card/producto-card';

@Component({
  selector: 'app-catalogo',
  imports: [ProductoCard, ReactiveFormsModule],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css'
})
export class Catalogo implements OnInit {
  private productoService = inject(ProductoService);
  private categoriaService = inject(CategoriaService);
  private fb = inject(FormBuilder);

  productos = signal<Producto[]>([]);
  categorias = signal<{ id: number; etiqueta: string }[]>([]);
  pagina = signal(0);
  totalPaginas = signal(1);
  totalResultados = signal(0);
  cargando = signal(false);
  error = signal<string | null>(null);

  private readonly TAMANO = 12;

  filtros = this.fb.group({
    q: this.fb.nonNullable.control(''),
    categoriaId: this.fb.nonNullable.control(0),
    precioMin: this.fb.control<number | null>(null),
    precioMax: this.fb.control<number | null>(null),
    soloDisponibles: this.fb.nonNullable.control(false),
    orden: this.fb.nonNullable.control('recientes')
  });

  constructor() {
    // Cada vez que cambia un filtro, esperamos 400 ms sin cambios y recargamos desde la página 1
    this.filtros.valueChanges
      .pipe(debounceTime(400), takeUntilDestroyed())
      .subscribe(() => this.cargar(0));
  }

  ngOnInit(): void {
    this.categoriaService.listarConEtiquetas().subscribe(c => this.categorias.set(c));
    this.cargar(0);
  }

  cargar(pagina: number): void {
    this.cargando.set(true);
    this.error.set(null);

    this.productoService.listar(pagina, this.TAMANO, this.filtros.getRawValue()).subscribe({
      next: (resp) => {
        this.productos.set(resp.content);
        this.totalPaginas.set(resp.page?.totalPages ?? resp.totalPages ?? 1);
        this.totalResultados.set(resp.page?.totalElements ?? resp.totalElements ?? resp.content.length);
        this.pagina.set(pagina);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el catálogo. ¿Está corriendo el backend?');
        this.cargando.set(false);
      }
    });
  }

  limpiarFiltros(): void {
    this.filtros.reset();
  }

  hayFiltrosActivos(): boolean {
    const f = this.filtros.getRawValue();
    return !!f.q || f.categoriaId !== 0 || f.precioMin != null || f.precioMax != null || f.soloDisponibles;
  }
}