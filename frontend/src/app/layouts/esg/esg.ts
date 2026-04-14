import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { BtnDemo } from '../../shared/components/btn-demo/btn-demo';

@Component({
  selector: 'app-esg',
  imports: [BtnDemo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './esg.html',
  styleUrl: './esg.scss',
})
export class Esg {
  close = output<void>();
}
