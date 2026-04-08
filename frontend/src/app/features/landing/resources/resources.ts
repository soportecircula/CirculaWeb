import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-resources',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './resources.html',
  styleUrl: '../../../../assets/scss/pages/resources.scss',
})
export class Resources {}
