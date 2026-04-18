import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BtnLogin } from '../../shared/components/btn-login/btn-login';
import { BtnDemo } from '../../shared/components/btn-demo/btn-demo';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule, BtnLogin, BtnDemo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './navbar.html',
})
export class Navbar {
  isMenuOpen = signal(false);

  toggleMenu(): void {
    this.isMenuOpen.update((value) => !value);
  }
}
