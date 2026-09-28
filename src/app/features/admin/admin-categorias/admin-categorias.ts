import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriaService } from '../../../core/services/categoria';
import { Categoria } from '../../../core/models/categoria.model';

@Component({
  selector: 'app-admin-categorias',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-categorias.html',
  styleUrl: './admin-categorias.css'
})
export class AdminCategorias implements OnInit {
  private fb = inject(FormBuilder);
  private categoriaService = inject(CategoriaService);

  categorias = signal<Categoria[]>([]);
  editandoId = signal<number | null>(null);
  guardando = signal(false);
  mensaje = signal<{ ok: boolean; texto: string } | null>(null);

  // Árbol: cada categoría principal con sus subcategorías
  arbol = computed(() => {
    const todas = this.categorias();
    return todas
      .filter(c => c.categoriaPadreId === null)
      .sort((a, b) => a.nombre.localeCompare(b.nombre))
      .map(raiz => ({
        ...raiz,
        hijas: todas.filter(c => c.categoriaPadreId === raiz.id)
      }));
  });

  // Opciones de padre: solo principales, y nunca la que se está editando
  opcionesPadre = computed(() =>
    this.arbol().filter(c => c.id !== this.editandoId())
  );

  form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    descripcion: [''],
    categoriaPadreId: [0]
  });

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.categoriaService.listar().subscribe(lista => this.categorias.set(lista));
  }

  editar(c: Categoria): void {
    this.editandoId.set(c.id);
    this.mensaje.set(null);
    this.form.setValue({
      nombre: c.nombre,
      descripcion: c.descripcion ?? '',
      categoriaPadreId: c.categoriaPadreId ?? 0
    });
  }

  cancelarEdicion(): void {
    this.editandoId.set(null);
    this.form.reset();
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const valores = this.form.getRawValue();
    const request = {
      nombre: valores.nombre,
      descripcion: valores.descripcion,
      categoriaPadreId: valores.categoriaPadreId === 0 ? null : valores.categoriaPadreId
    };

    const id = this.editandoId();
    const operacion = id
      ? this.categoriaService.actualizar(id, request)
      : this.categoriaService.crear(request);

    this.guardando.set(true);
    operacion.subscribe({
      next: () => {
        this.mensaje.set({ ok: true, texto: id ? 'Categoría actualizada' : 'Categoría creada' });
        this.guardando.set(false);
        this.cancelarEdicion();
        this.cargar();
      },
      error: (err) => {
        this.mensaje.set({ ok: false, texto: err.error?.message ?? 'No se pudo guardar la categoría' });
        this.guardando.set(false);
      }
    });
  }

  eliminar(c: Categoria): void {
    if (!confirm(`¿Eliminar la categoría "${c.nombre}"?`)) return;

    this.categoriaService.eliminar(c.id).subscribe({
      next: () => {
        this.mensaje.set({ ok: true, texto: `"${c.nombre}" eliminada` });
        if (this.editandoId() === c.id) this.cancelarEdicion();
        this.cargar();
      },
      error: (err) => {
        this.mensaje.set({ ok: false, texto: err.error?.message ?? 'No se pudo eliminar la categoría' });
      }
    });
  }
}