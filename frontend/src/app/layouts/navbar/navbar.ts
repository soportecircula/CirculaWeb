import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './navbar.html',
  styleUrl: '../../../assets/scss/structure/navbar.scss',
})
export class Navbar {
  isMenuOpen = signal(false);

  toggleMenu(): void {
    this.isMenuOpen.update((value) => !value);
  }
}
