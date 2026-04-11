import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { REP } from '../../../layouts/rep/rep';
import { Esg } from '../../../layouts/esg/esg';

@Component({
  selector: 'app-products',
  imports: [REP, Esg],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products {
  showRep = signal(false);
  showEsg = signal(false);
}
