import { Component, input } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Producto } from '../../core/models/producto.model';

@Component({
  selector: 'app-producto-card',
  imports: [CurrencyPipe, DecimalPipe],
  templateUrl: './producto-card.html',
  styleUrl: './producto-card.css'
})
export class ProductoCard {
  producto = input.required<Producto>();
}