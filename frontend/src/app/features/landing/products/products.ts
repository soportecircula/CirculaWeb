import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { BtnDemo } from '../../../shared/components/btn-demo/btn-demo';

@Component({
  selector: 'app-products',
  imports: [BtnDemo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './products.html',
})
export class Products {
}
