import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Output,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../core/auth/auth.service';
import { avatarUrl } from '../../core/utils/image-url';
import * as AuthActions from '../../store/Authentication/authentication.actions';

@Component({
  selector: 'app-topbar',
  imports: [RouterLink, NgbDropdownModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header id="page-topbar">
      <div class="layout-width">
        <div class="navbar-header">
          <div class="d-flex">
            <!-- LOGO -->
            <div class="navbar-brand-box horizontal-logo">
              <a routerLink="/" class="logo logo-dark">
                <span class="logo-sm">
                  <img src="assets/images/logo-sm.png" alt="Circula" height="22">
                </span>
                <span class="logo-lg">
                  <img src="assets/images/logo.jpg" alt="Circula" height="30">
                </span>
              </a>
              <a routerLink="/" class="logo logo-light">
                <span class="logo-sm">
                  <img src="assets/images/logo-sm.png" alt="Circula" height="22">
                </span>
                <span class="logo-lg">
                  <img src="assets/images/logo.jpg" alt="Circula" height="30">
                </span>
              </a>
            </div>

            <!-- Hamburger -->
            <button type="button"
              class="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger material-shadow-none"
              id="topnav-hamburger-icon"
              (click)="toggleMobileMenu($event)">
              <span class="hamburger-icon">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>
          </div>

          <div class="d-flex align-items-center">

            <!-- Fullscreen -->
            <div class="ms-1 header-item d-none d-sm-flex">
              <button type="button"
                class="btn btn-icon btn-topbar material-shadow-none btn-ghost-secondary rounded-circle"
                (click)="fullscreen()">
                <i class='bx bx-fullscreen fs-22'></i>
              </button>
            </div>

            <!-- Dark / Light mode -->
            <div class="ms-1 header-item d-none d-sm-flex">
              <button type="button"
                class="btn btn-icon btn-topbar material-shadow-none btn-ghost-secondary rounded-circle light-dark-mode"
                (click)="toggleMode()">
                @if (isDark) {
                  <i class='bx bx-sun fs-22'></i>
                } @else {
                  <i class='bx bx-moon fs-22'></i>
                }
              </button>
            </div>

            <!-- User dropdown -->
            <div class="dropdown ms-sm-3 header-item topbar-user" ngbDropdown>
              <button type="button" class="btn material-shadow-none"
                ngbDropdownToggle>
                <span class="d-flex align-items-center">
                  <img class="rounded-circle header-profile-user"
                    [src]="avatarUrl(auth.user()?.avatar_url)"
                    alt="Avatar"
                    (error)="$any($event.target).src=avatarUrl(null)">
                  <span class="text-start ms-xl-2">
                    <span class="d-none d-xl-inline-block ms-1 fw-medium user-name-text">
                      {{ auth.user()?.full_name || auth.user()?.email }}
                    </span>
                    <span class="d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text">
                      {{ auth.isSuperAdmin() ? 'Super Admin' : 'Usuario' }}
                    </span>
                  </span>
                </span>
              </button>
              <div class="dropdown-menu dropdown-menu-end" ngbDropdownMenu>
                <h6 class="dropdown-header">
                  Bienvenido{{ auth.user()?.full_name ? ', ' + auth.user()!.full_name : '' }}
                </h6>
                <a class="dropdown-item" routerLink="/dashboard/profile" ngbDropdownItem>
                  <i class="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>
                  <span class="align-middle">Mi Perfil</span>
                </a>
                <a class="dropdown-item" routerLink="/dashboard/change-password" ngbDropdownItem>
                  <i class="mdi mdi-lock-reset text-muted fs-16 align-middle me-1"></i>
                  <span class="align-middle">Cambiar Contraseña</span>
                </a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="javascript:void(0)" (click)="logout()" ngbDropdownItem>
                  <i class="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>
                  <span class="align-middle">Cerrar Sesión</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </header>
  `,
})
export class TopbarComponent {
  @Output() mobileMenuButtonClicked = new EventEmitter<void>();

  readonly auth = inject(AuthService);
  private readonly store = inject(Store);
  protected avatarUrl = avatarUrl;

  isDark = false;

  @HostListener('window:scroll')
  windowScroll(): void {
    const topbar = document.getElementById('page-topbar');
    if (window.scrollY > 80) {
      topbar?.classList.add('topbar-shadow');
    } else {
      topbar?.classList.remove('topbar-shadow');
    }
  }

  toggleMobileMenu(event: Event): void {
    event.preventDefault();
    document.querySelector('.hamburger-icon')?.classList.toggle('open');
    this.mobileMenuButtonClicked.emit();
  }

  fullscreen(): void {
    const el = document.documentElement as any;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.() ?? el.mozRequestFullScreen?.() ?? el.webkitRequestFullscreen?.();
    } else {
      (document as any).exitFullscreen?.() ?? (document as any).mozCancelFullScreen?.() ?? (document as any).webkitExitFullscreen?.();
    }
  }

  toggleMode(): void {
    this.isDark = !this.isDark;
    document.documentElement.setAttribute('data-bs-theme', this.isDark ? 'dark' : 'light');
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
