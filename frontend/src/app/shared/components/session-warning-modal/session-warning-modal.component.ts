import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

const WARN_REMAINING_S = 5 * 60;

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-session-warning-modal',
  templateUrl: './session-warning-modal.component.html',
})
export class SessionWarningModalComponent implements OnInit, OnDestroy {
  readonly activeModal = inject(NgbActiveModal);

  remaining = signal(WARN_REMAINING_S);
  private intervalId: ReturnType<typeof setInterval> | null = null;

  get minutes() { return Math.floor(this.remaining() / 60); }
  get secondsDisplay() { return String(this.remaining() % 60).padStart(2, '0'); }

  ngOnInit() {
    this.intervalId = setInterval(() => {
      const next = this.remaining() - 1;
      this.remaining.set(next);
      if (next <= 0) this.activeModal.dismiss('timeout');
    }, 1000);
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  stay()   { this.activeModal.close('stay'); }
  logout() { this.activeModal.close('logout'); }
}
