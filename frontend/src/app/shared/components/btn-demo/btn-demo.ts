import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-btn-demo',
  standalone: true,
  imports: [RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './btn-demo.html',
  styleUrl: '../../../../assets/scss/components/btn-demo.scss',
})
export class BtnDemo {
  @Input() variant: 'navbar' | 'hero' = 'hero';
  @Output() clicked = new EventEmitter<void>();
}
