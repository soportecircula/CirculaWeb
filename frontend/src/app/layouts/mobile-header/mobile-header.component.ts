import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { avatarUrl } from '../../core/utils/image-url';

@Component({
  selector: 'app-mobile-header',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="mobile-header d-flex align-items-center px-3">
      <button type="button" class="btn btn-link p-0 me-2"
        (click)="toggleMenu.emit()" aria-label="Abrir menú">
        <i class="mdi mdi-menu mdi-24px"></i>
      </button>

      <a routerLink="/dashboard" class="d-flex align-items-center gap-2 text-decoration-none">
        <img src="assets/images/logo-sm.png" alt="Circula" height="24">
        <span class="fw-semibold">Circula</span>
      </a>

      <div class="flex-grow-1"></div>

      <div class="dropdown position-relative">
        <button type="button" class="btn btn-link p-0 d-flex align-items-center"
          (click)="dropdownOpen.set(!dropdownOpen())"
          (blur)="closeDropdownDelayed()">
          <img [src]="avatarUrl(auth.user()?.avatar_url)" [alt]="auth.user()?.full_name"
            class="rounded-circle" style="width: 32px; height: 32px; object-fit: cover;"
            (error)="$any($event.target).src=avatarUrl(null)">
        </button>
        @if (dropdownOpen()) {
          <ul class="dropdown-menu dropdown-menu-end show"
            style="position: absolute; inset-inline-end: 0; top: 100%; min-width: 180px; margin-top: 0.25rem;">
            <li>
              <a class="dropdown-item" routerLink="/dashboard/profile"
                (mousedown)="$event.preventDefault()"
                (click)="dropdownOpen.set(false)">
                <i class="mdi mdi-account-outline me-2"></i>Mi perfil
              </a>
            </li>
            <li><hr class="dropdown-divider"></li>
            <li>
              <a class="dropdown-item" href="javascript:void(0)"
                (mousedown)="$event.preventDefault()"
                (click)="logout(); dropdownOpen.set(false)">
                <i class="mdi mdi-logout me-2"></i>Cerrar sesión
              </a>
            </li>
          </ul>
        }
      </div>
    </header>
  `,
})
export class MobileHeaderComponent {
  readonly auth = inject(AuthService);
  readonly avatarUrl = avatarUrl;
  toggleMenu = output<void>();
  dropdownOpen = signal(false);

  closeDropdownDelayed(): void {
    setTimeout(() => this.dropdownOpen.set(false), 200);
  }

  logout(): void {
    this.auth.logout();
  }
}
