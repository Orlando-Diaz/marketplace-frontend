import { Component, OnInit, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductoService } from '../../../core/services/producto';
import { CategoriaService } from '../../../core/services/categoria';
import { Categoria } from '../../../core/models/categoria.model';

@Component({
  selector: 'app-publicar-producto',
  imports: [ReactiveFormsModule],
  templateUrl: './publicar-producto.html',
  styleUrl: './publicar-producto.css'
})
export class PublicarProducto implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private productoService = inject(ProductoService);
  private categoriaService = inject(CategoriaService);

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
    imagenes: this.fb.array<FormControl<string>>([])
  });

  get imagenes(): FormArray<FormControl<string>> {
    return this.form.controls.imagenes;
  }

  ngOnInit(): void {
  this.agregarImagen();
  this.categoriaService.listarConEtiquetas().subscribe(c => this.categorias.set(c));
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
      imagenes: valores.imagenes.map(u => u.trim()).filter(u => u.length > 0)
    };

    this.productoService.crear(request).subscribe({
      next: (producto) => this.router.navigate(['/productos', producto.id]),
      error: (err) => {
        this.publicando.set(false);
        this.error.set(
          err.error?.message ??
          (err.error?.errores ? Object.values(err.error.errores).join('. ') : 'No se pudo publicar el producto')
        );
      }
    });
  }
}