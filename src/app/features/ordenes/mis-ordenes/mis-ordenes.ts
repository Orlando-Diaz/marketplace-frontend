import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrdenService } from '../../../core/services/orden';
import { ResenaService } from '../../../core/services/resena';
import { Orden } from '../../../core/models/orden.model';

@Component({
  selector: 'app-mis-ordenes',
  imports: [CurrencyPipe, DatePipe, RouterLink, ReactiveFormsModule],
  templateUrl: './mis-ordenes.html',
  styleUrl: './mis-ordenes.css'
})
export class MisOrdenes implements OnInit {
  private route = inject(ActivatedRoute);
  private ordenService = inject(OrdenService);
  private resenaService = inject(ResenaService);

  ordenes = signal<Orden[]>([]);
  cargando = signal(true);
  error = signal<string | null>(null);
  ordenNueva = signal<number | null>(null);

  // Estado del formulario de reseña
  resenandoProductoId = signal<number | null>(null);
  calificacion = signal(0);
  comentario = new FormControl('', { nonNullable: true });
  enviandoResena = signal(false);

  // Resultado por producto: mensaje de éxito o error
  resultados = signal<Record<number, { ok: boolean; mensaje: string }>>({});

  ngOnInit(): void {
    const nueva = this.route.snapshot.queryParamMap.get('nueva');
    this.ordenNueva.set(nueva ? Number(nueva) : null);

    this.ordenService.misOrdenes().subscribe({
      next: (lista) => {
        this.ordenes.set([...lista].sort((a, b) => b.fecha.localeCompare(a.fecha)));
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar tu historial de compras.');
        this.cargando.set(false);
      }
    });
  }

  abrirResena(productoId: number): void {
    this.resenandoProductoId.set(productoId);
    this.calificacion.set(0);
    this.comentario.reset();
  }

  cancelarResena(): void {
    this.resenandoProductoId.set(null);
  }

  enviarResena(productoId: number): void {
    if (this.calificacion() === 0) return;

    this.enviandoResena.set(true);

    this.resenaService.crear({
      productoId,
      calificacion: this.calificacion(),
      comentario: this.comentario.value
    }).subscribe({
      next: () => this.terminarResena(productoId, true, '¡Gracias por tu reseña!'),
      error: (err) => this.terminarResena(productoId, false, err.error?.message ?? 'No se pudo enviar la reseña')
    });
  }

  private terminarResena(productoId: number, ok: boolean, mensaje: string): void {
    this.enviandoResena.set(false);
    this.resenandoProductoId.set(null);
    this.resultados.update(r => ({ ...r, [productoId]: { ok, mensaje } }));
  }
}