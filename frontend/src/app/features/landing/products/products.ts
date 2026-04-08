import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { REP } from '../../../layouts/rep/rep';

@Component({
  selector: 'app-products',
  imports: [REP],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './products.html',
  styleUrl: '../../../../assets/scss/pages/products.scss',
})
export class Products {
  showRep = signal(false);
}
