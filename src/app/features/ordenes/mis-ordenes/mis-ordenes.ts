import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrdenService } from '../../../core/services/orden';
import { Orden } from '../../../core/models/orden.model';

@Component({
  selector: 'app-mis-ordenes',
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './mis-ordenes.html',
  styleUrl: './mis-ordenes.css'
})
export class MisOrdenes implements OnInit {
  private route = inject(ActivatedRoute);
  private ordenService = inject(OrdenService);

  ordenes = signal<Orden[]>([]);
  cargando = signal(true);
  error = signal<string | null>(null);
  ordenNueva = signal<number | null>(null);

  ngOnInit(): void {
    const nueva = this.route.snapshot.queryParamMap.get('nueva');
    this.ordenNueva.set(nueva ? Number(nueva) : null);

    this.ordenService.misOrdenes().subscribe({
      next: (lista) => {
        // Más recientes primero
        this.ordenes.set([...lista].sort((a, b) => b.fecha.localeCompare(a.fecha)));
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar tu historial de compras.');
        this.cargando.set(false);
      }
    });
  }
}