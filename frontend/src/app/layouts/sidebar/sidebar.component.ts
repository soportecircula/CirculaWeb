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
    label: 'Servicios',
    icon: 'mdi mdi-view-dashboard',
    link: '/dashboard',
  },
  { label: 'Perfil', icon: '', isTitle: true },
  {
    label: 'Mi Perfil',
    icon: 'mdi mdi-account-circle-outline',
    link: '/dashboard/profile',
  },
  {
    label: 'Cambiar Contraseña',
    icon: 'mdi mdi-lock-reset',
    link: '/dashboard/change-password',
  },
];

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, NgbDropdownModule, NgbCollapseModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sidebar.html',
  styles: [`
    .nav-link.menu-link {
      transition: all 0.3s ease;
    }
    .nav-link.menu-link:hover {
      background-color: rgba(var(--vz-primary-rgb, 64, 81, 137), 0.05);
      color: var(--vz-primary, #405189) !important;
    }
    .nav-link.menu-link:hover i {
      color: var(--vz-primary, #405189) !important;
    }
    :host-context([data-sidebar-size="sm-hover-active"]) .navbar-brand-box,
    :host-context([data-sidebar-size="sm-hover"]) .navbar-brand-box,
    :host-context([data-sidebar-size="sm"]) .navbar-brand-box {
      text-align: center !important;
    }
  `]
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