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
    templateUrl: './topbar.html'
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
        const mode = this.isDark ? 'dark' : 'light';
        document.documentElement.setAttribute('data-bs-theme', mode);
        document.documentElement.setAttribute('data-sidebar', mode);
    }

    logout(): void {
        this.store.dispatch(AuthActions.logout());
    }
}
