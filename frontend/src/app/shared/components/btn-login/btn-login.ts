import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-btn-login',
  standalone: true,
  imports: [RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './btn-login.html',
  styleUrl: '../../../../assets/scss/components/btn-login.scss',
})
export class BtnLogin {
  @Input() variant: 'navbar' | 'hero' = 'hero';
  @Output() clicked = new EventEmitter<void>();
}
