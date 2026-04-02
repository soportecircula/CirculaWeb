import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { TopbarComponent } from './topbar/topbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { selectLayoutState } from '../store/Layout/layout.selectors';
import * as LayoutActions from '../store/Layout/layout.actions';
import { LayoutState } from '../store/Layout/layout.models';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, TopbarComponent, SidebarComponent, FooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(window:resize)': 'onResize()' },
  template: `
    <div id="layout-wrapper">
      <app-topbar (mobileMenuButtonClicked)="onToggleMobileMenu()" />
      <app-sidebar />
      <div class="main-content">
        <div class="page-content">
          <div class="container-fluid">
            <router-outlet />
          </div>
        </div>
        <app-footer />
      </div>
    </div>
  `,
})
export class LayoutComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly destroyRef = inject(DestroyRef);

  private sidebarCollapsed = false;

  ngOnInit(): void {
    this.store
      .select(selectLayoutState)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((layout) => this.applyLayoutAttributes(layout));
    this.onResize();
  }

  onToggleMobileMenu(): void {
    const w = document.documentElement.clientWidth;
    if (w <= 767) {
      document.body.classList.toggle('vertical-sidebar-enable');
    } else {
      this.sidebarCollapsed = !this.sidebarCollapsed;
      const newSize = this.sidebarCollapsed ? 'sm' : 'lg';
      this.store.dispatch(LayoutActions.changeSidebarSize({ sidebarSize: newSize }));
      document.documentElement.setAttribute('data-sidebar-size', newSize);
      document.querySelector('.hamburger-icon')?.classList.toggle('open', this.sidebarCollapsed);
    }
  }

  onResize(): void {
    const w = document.documentElement.clientWidth;
    if (w <= 767) {
      document.documentElement.setAttribute('data-sidebar-size', '');
      document.body.classList.remove('vertical-sidebar-enable');
    } else if (w <= 1024) {
      document.documentElement.setAttribute('data-sidebar-size', 'sm');
      this.sidebarCollapsed = true;
    } else {
      document.documentElement.setAttribute(
        'data-sidebar-size',
        this.sidebarCollapsed ? 'sm' : 'lg',
      );
    }
  }

  private applyLayoutAttributes(layout: LayoutState): void {
    const doc = document.documentElement;
    doc.setAttribute('data-layout', layout.LAYOUT);
    doc.setAttribute('data-theme', layout.LAYOUT_THEME);
    doc.setAttribute('data-theme-colors', layout.LAYOUT_THEME_COLOR);
    doc.setAttribute('data-bs-theme', layout.LAYOUT_MODE);
    doc.setAttribute('data-layout-width', layout.LAYOUT_WIDTH);
    doc.setAttribute('data-layout-position', layout.LAYOUT_POSITION);
    doc.setAttribute('data-topbar', layout.TOPBAR);
    doc.setAttribute('data-sidebar', layout.SIDEBAR_COLOR);
    doc.setAttribute('data-sidebar-image', layout.SIDEBAR_IMAGE);
    doc.setAttribute('data-layout-style', layout.SIDEBAR_VIEW);
    doc.setAttribute('data-sidebar-visibility', layout.SIDEBAR_VISIBILITY);
    doc.setAttribute('data-body-image', layout.BACKGROUND_IMAGE);
    doc.setAttribute('data-preloader', layout.DATA_PRELOADER);

    this.sidebarCollapsed = layout.SIDEBAR_SIZE !== 'lg';
    this.onResize();
  }
}
