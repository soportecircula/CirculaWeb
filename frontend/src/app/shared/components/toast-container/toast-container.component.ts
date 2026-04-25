import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from '../../../core/notifications/notification.service';

@Component({
  selector: 'app-toast-container',
  imports: [NgbToast],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1200;">
      @for (toast of notif.toasts(); track toast.id) {
        <ngb-toast
          [class]="bgClass(toast.type)"
          [autohide]="true"
          [delay]="toast.delay"
          (hidden)="notif.remove(toast.id)">
          <div class="d-flex align-items-center gap-2">
            <i [class]="iconFor(toast.type) + ' fs-16 flex-shrink-0'"></i>
            <span class="fs-13">{{ toast.message }}</span>
          </div>
        </ngb-toast>
      }
    </div>
  `,
})
export class ToastContainerComponent {
  readonly notif = inject(NotificationService);

  bgClass(type: string): string {
    const map: Record<string, string> = {
      success: 'text-bg-primary border-0',
      error: 'text-bg-danger border-0',
      info: 'text-bg-info border-0',
      warning: 'text-bg-warning border-0',
    };
    return map[type] ?? '';
  }

  iconFor(type: string): string {
    const map: Record<string, string> = {
      success: 'mdi mdi-check-circle-outline',
      error: 'mdi mdi-alert-circle-outline',
      info: 'mdi mdi-information-outline',
      warning: 'mdi mdi-alert-outline',
    };
    return map[type] ?? 'mdi mdi-bell-outline';
  }
}
