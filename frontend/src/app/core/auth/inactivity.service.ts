import { effect, inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { fromEvent, merge, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from './auth.service';
import { SessionWarningModalComponent } from '../../shared/components/session-warning-modal/session-warning-modal.component';
import * as AuthActions from '../../store/Authentication/authentication.actions';

const IDLE_MS = 15 * 60 * 1000;    // 15 minutos (reducido a 2 para pruebas)
const WARN_MS = 10 * 60 * 1000;    // aviso a los 10 minutos (reducido a 1 para pruebas)
export const INACTIVITY_FLAG = 'circula_inactivity';

@Injectable({ providedIn: 'root' })
export class InactivityService {
  private readonly auth = inject(AuthService);
  private readonly store = inject(Store);
  private readonly modal = inject(NgbModal);

  private warnTimer: ReturnType<typeof setTimeout> | null = null;
  private idleTimer: ReturnType<typeof setTimeout> | null = null;
  private activitySub: Subscription | null = null;
  private modalRef: NgbModalRef | null = null;

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
    this.closeModal();
    this.clearTimers();
  }

  private reset(): void {
    this.clearTimers();
    this.closeModal();
    this.warnTimer = setTimeout(() => this.openWarningModal(), WARN_MS);
    this.idleTimer = setTimeout(() => {
      this.closeModal();
      sessionStorage.setItem(INACTIVITY_FLAG, '1');
      this.store.dispatch(AuthActions.logout());
    }, IDLE_MS);
  }

  private openWarningModal(): void {
    if (this.modalRef) return;
    this.modalRef = this.modal.open(SessionWarningModalComponent, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
    });
    this.modalRef.result.then(
      (result) => {
        this.modalRef = null;
        if (result === 'stay') this.reset();
        else if (result === 'logout') {
          this.clearTimers();
          sessionStorage.setItem(INACTIVITY_FLAG, '1');
          this.store.dispatch(AuthActions.logout());
        }
      },
      () => { this.modalRef = null; },
    );
  }

  private closeModal(): void {
    if (this.modalRef) { this.modalRef.dismiss('closed'); this.modalRef = null; }
  }

  private clearTimers(): void {
    if (this.warnTimer !== null) { clearTimeout(this.warnTimer); this.warnTimer = null; }
    if (this.idleTimer !== null) { clearTimeout(this.idleTimer); this.idleTimer = null; }
  }
}
