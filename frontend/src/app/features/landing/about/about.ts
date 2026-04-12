import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BrandsSlider } from '../../../layouts/brands-slider/brands-slider';

@Component({
  selector: 'app-about',
  imports: [BrandsSlider],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {}
