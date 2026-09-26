import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductoService } from '../../core/services/producto';
import { AuthService } from '../../core/services/auth';
import { Producto } from '../../core/models/producto.model';
import { ProductoCard } from '../../shared/producto-card/producto-card';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink, ProductoCard],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class Inicio implements OnInit {
  private productoService = inject(ProductoService);
  authService = inject(AuthService);

  ultimos = signal<Producto[]>([]);
  cargando = signal(true);

  ngOnInit(): void {
    this.productoService.listar(0, 8).subscribe({
      next: (resp) => {
        this.ultimos.set(resp.content);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }
}