import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { BtnDemo } from '../../shared/components/btn-demo/btn-demo';

@Component({
  selector: 'app-rep',
  imports: [BtnDemo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './rep.html',
  styleUrl: './rep.scss',
})
export class REP {
  close = output<void>();
}
