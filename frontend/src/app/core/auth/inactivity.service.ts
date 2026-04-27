import { effect, inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { fromEvent, merge, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { NotificationService } from '../notifications/notification.service';
import * as AuthActions from '../../store/Authentication/authentication.actions';

const IDLE_MS = 15 * 60 * 1000;    // 15 minutos
const WARN_MS = 10 * 60 * 1000;    // aviso a los 10 minutos
export const INACTIVITY_FLAG = 'circula_inactivity';

@Injectable({ providedIn: 'root' })
export class InactivityService {
  private readonly auth = inject(AuthService);
  private readonly notif = inject(NotificationService);
  private readonly store = inject(Store);

  private warnTimer: ReturnType<typeof setTimeout> | null = null;
  private idleTimer: ReturnType<typeof setTimeout> | null = null;
  private activitySub: Subscription | null = null;

  constructor() {
    effect(() => {
      if (this.auth.isAuthenticated()) {
        this.startWatching();
      } else {
        this.stopWatching();
      }
    });
  }

  private startWatching(): void {
    if (this.activitySub) return;
    const activity$ = merge(
      fromEvent(document, 'mousedown'),
      fromEvent(document, 'keydown'),
      fromEvent(document, 'scroll', { passive: true } as AddEventListenerOptions),
      fromEvent(document, 'touchstart', { passive: true } as AddEventListenerOptions),
      fromEvent(document, 'click'),
    ).pipe(throttleTime(2000));

    this.activitySub = activity$.subscribe(() => this.reset());
    this.reset();
  }

  private stopWatching(): void {
    this.activitySub?.unsubscribe();
    this.activitySub = null;
    this.clearTimers();
  }

  private reset(): void {
    this.clearTimers();
    this.warnTimer = setTimeout(() => {
      this.notif.warning('Tu sesión expirará en 5 minutos por inactividad.', 10000);
    }, WARN_MS);
    this.idleTimer = setTimeout(() => {
      sessionStorage.setItem(INACTIVITY_FLAG, '1');
      this.store.dispatch(AuthActions.logout());
    }, IDLE_MS);
  }

  private clearTimers(): void {
    if (this.warnTimer !== null) { clearTimeout(this.warnTimer); this.warnTimer = null; }
    if (this.idleTimer !== null) { clearTimeout(this.idleTimer); this.idleTimer = null; }
  }
}
