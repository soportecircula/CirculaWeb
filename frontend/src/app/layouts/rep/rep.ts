import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'app-rep',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './rep.html',
  styleUrl: '../../../assets/scss/structure/rep.scss',
})
export class REP {
  close = output<void>();
}
