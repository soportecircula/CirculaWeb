import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgbCollapseModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../core/auth/auth.service';
import { avatarUrl } from '../../core/utils/image-url';
import * as AuthActions from '../../store/Authentication/authentication.actions';
import { Store } from '@ngrx/store';

interface MenuItem {
  label: string;
  icon: string;
  link?: string;
  isTitle?: boolean;
  subItems?: MenuItem[];
  isCollapsed?: boolean;
}

const MENU: MenuItem[] = [
  { label: 'Menu', isTitle: true, icon: '' },
  {
    label: 'Dashboard',
    icon: 'bx bxs-dashboard',
    link: '/dashboard',
  },
  { label: 'Perfil', icon: '', isTitle: true },
  {
    label: 'Mi Perfil',
    icon: 'bx bx-user-circle',
    link: '/dashboard/profile',
  },
  {
    label: 'Cambiar Contraseña',
    icon: 'bx bx-lock-alt',
    link: '/dashboard/change-password',
  },
];

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, NgbDropdownModule, NgbCollapseModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- ========== App Menu ========== -->
    <div class="app-menu navbar-menu">
      <!-- LOGO -->
      <div class="navbar-brand-box">
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
        <button type="button"
          class="btn btn-sm p-0 fs-20 header-item float-end btn-vertical-sm-hover"
          id="vertical-hover"
          (click)="toggleSidebarSize()">
          <i class="ri-record-circle-line"></i>
        </button>
      </div>

      <!-- User dropdown -->
      <div class="dropdown sidebar-user m-1 rounded" ngbDropdown>
        <button type="button" class="btn material-shadow-none" ngbDropdownToggle>
          <span class="d-flex align-items-center gap-2">
            <img class="rounded header-profile-user"
              [src]="avatarUrl(auth.user()?.avatar_url)"
              alt="Avatar"
              (error)="$any($event.target).src=avatarUrl(null)">
            <span class="text-start">
              <span class="d-block fw-medium sidebar-user-name-text">
                {{ auth.user()?.full_name || auth.user()?.email }}
              </span>
              <span class="d-block fs-14 sidebar-user-name-sub-text">
                <i class="ri ri-circle-fill fs-10 text-success align-baseline"></i>
                <span class="align-middle ms-1">Online</span>
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

      <!-- Menu scroll -->
      <div id="scrollbar">
        <div class="container-fluid">
          <div id="two-column-menu"></div>
          <div class="sidebar-menu-scroll"
            style="max-height: calc(100vh - 70px); overflow-y: auto; overflow-x: hidden;">
            <ul class="metismenu list-unstyled navbar-nav" id="navbar-nav">
              @for (item of menuItems; track $index) {
                @if (item.isTitle) {
                  <li class="menu-title"><span>{{ item.label }}</span></li>
                } @else {
                  <li class="nav-item">
                    @if (item.subItems?.length) {
                      <a href="javascript:void(0);"
                        class="is-parent nav-link menu-link has-arrow"
                        [attr.aria-expanded]="!item.isCollapsed"
                        (click)="toggleItem(item)">
                        <i class="{{ item.icon }} icon nav-icon"></i>
                        <span>{{ item.label }}</span>
                      </a>
                      <div class="collapse menu-dropdown" [ngbCollapse]="item.isCollapsed ?? true">
                        <ul class="nav nav-sm flex-column">
                          @for (sub of item.subItems; track $index) {
                            <li class="nav-item">
                              <a [routerLink]="sub.link" class="nav-link" routerLinkActive="active">
                                {{ sub.label }}
                              </a>
                            </li>
                          }
                        </ul>
                      </div>
                    } @else {
                      <a [routerLink]="item.link"
                        routerLinkActive="active"
                        [routerLinkActiveOptions]="{exact: item.link === '/dashboard'}"
                        class="side-nav-link-ref nav-link menu-link">
                        <i class="{{ item.icon }} icon nav-icon"></i>
                        <span>{{ item.label }}</span>
                      </a>
                    }
                  </li>
                }
              }
            </ul>
          </div>
        </div>
      </div>
      <div class="sidebar-background"></div>
    </div>
    <!-- Left Sidebar End -->

    <!-- Vertical Overlay -->
    <div class="vertical-overlay" (click)="sidebarHide()"></div>
  `,
})
export class SidebarComponent implements OnInit {
  readonly auth = inject(AuthService);
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  protected avatarUrl = avatarUrl;

  menuItems: MenuItem[] = MENU.map((item) => ({ ...item, isCollapsed: true }));

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        document.body.classList.remove('vertical-sidebar-enable');
      }
    });
  }

  toggleItem(item: MenuItem): void {
    this.menuItems.forEach((m) => {
      if (m !== item) m.isCollapsed = true;
    });
    item.isCollapsed = !item.isCollapsed;
  }

  toggleSidebarSize(): void {
    const size = document.documentElement.getAttribute('data-sidebar-size');
    document.documentElement.setAttribute(
      'data-sidebar-size',
      size === 'sm-hover-active' ? 'sm-hover' : 'sm-hover-active',
    );
  }

  sidebarHide(): void {
    document.body.classList.remove('vertical-sidebar-enable');
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
