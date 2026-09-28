import { Component, OnInit, inject, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProductoService } from '../../../core/services/producto';
import { CategoriaService } from '../../../core/services/categoria';
import { Categoria } from '../../../core/models/categoria.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-publicar-producto',
  imports: [ReactiveFormsModule],
  templateUrl: './publicar-producto.html',
  styleUrl: './publicar-producto.css',
})
export class PublicarProducto implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private productoService = inject(ProductoService);
  private categoriaService = inject(CategoriaService);
  private route = inject(ActivatedRoute);
  editandoId = signal<number | null>(null);

  categorias = signal<{ id: number; etiqueta: string }[]>([]);
  publicando = signal(false);
  error = signal<string | null>(null);

  readonly MAX_IMAGENES = 5;

  form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
    precio: [0, [Validators.required, Validators.min(1)]],
    stock: [1, [Validators.required, Validators.min(0)]],
    categoriaId: [0, Validators.min(1)],
    imagenes: this.fb.array<FormControl<string>>([]),
  });

  get imagenes(): FormArray<FormControl<string>> {
    return this.form.controls.imagenes;
  }

  ngOnInit(): void {
    this.categoriaService.listarConEtiquetas().subscribe((c) => this.categorias.set(c));

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.agregarImagen();
      return;
    }

    this.editandoId.set(Number(id));
    this.productoService.obtenerPorId(Number(id)).subscribe({
      next: (p) => {
        this.form.patchValue({
          nombre: p.nombre,
          descripcion: p.descripcion,
          precio: p.precio,
          stock: p.stock,
          categoriaId: p.categoriaId,
        });
        this.imagenes.clear();
        p.imagenes.forEach((url) => this.imagenes.push(this.fb.nonNullable.control(url)));
        if (p.imagenes.length === 0) this.agregarImagen();
      },
      error: () => this.error.set('No se pudo cargar el producto a editar.'),
    });
  }

  agregarImagen(): void {
    if (this.imagenes.length < this.MAX_IMAGENES) {
      this.imagenes.push(this.fb.nonNullable.control(''));
    }
  }

  quitarImagen(indice: number): void {
    this.imagenes.removeAt(indice);
  }

  publicar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.publicando.set(true);
    this.error.set(null);

    const valores = this.form.getRawValue();
    const request = {
      ...valores,
      imagenes: valores.imagenes.map((u) => u.trim()).filter((u) => u.length > 0),
    };

    const id = this.editandoId();
    const operacion = id
      ? this.productoService.actualizar(id, request)
      : this.productoService.crear(request);

    operacion.subscribe({
      next: (producto) => this.router.navigate(['/productos', producto.id]),
      error: (err) => {
        this.publicando.set(false);
        this.error.set(
          err.error?.message ??
            (err.error?.errores
              ? Object.values(err.error.errores).join('. ')
              : 'No se pudo publicar el producto'),
        );
      },
    });
  }
}
