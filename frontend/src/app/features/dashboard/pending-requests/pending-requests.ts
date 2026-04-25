import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../../../client';
import { NotificationService } from '../../../core/notifications/notification.service';
import { getApiErrorDetail } from '../../../core/notifications/messages';
import { ContactRequestRead } from '../../../../client';

const PLAN_LABELS: Record<string, string> = {
  demo_rep: 'Diagnóstico REP / Productores',
  demo_indv: 'Plan Individual',
  demo_col: 'Plan Colectivo',
  demo_esg: 'Infraestructura ESG',
  support: 'Soporte',
  info: 'Información',
}

@Component({
  selector: 'app-pending-requests',
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pending-requests.html',
})
export class PendingRequests implements OnInit {
  private readonly contactService = inject(ContactService);
  private readonly notif = inject(NotificationService);

  requests = signal<ContactRequestRead[]>([]);
  loading = signal(false);
  processing = signal<number | null>(null);
  expandedId = signal<number | null>(null);
  rejectNote = '';

  ngOnInit(): void {
    this.load();
  }

  load(): void{
    this.loading.set(true);
    this.contactService.contactListRequest().subscribe({
      next: (res) => {
        this.requests.set(res.items);
        this.loading.set(false);
      },
      error: (err) => {
        this.notif.error(getApiErrorDetail(err));
        this.loading.set(false);
      },
    });
  }

  approve(id: number): void{
    this.processing.set(id);
    this.contactService.contactApproveRequest(id).subscribe({
      next: (updated) => {
        this.requests.update((list) => list.map((r) => (r.id === id ? updated : r)));
        this.processing.set(null);
        this.notif.success('Solicitud aprobada correctamente');
      },
      error: (err) => {
        this.notif.error(getApiErrorDetail(err));
        this.processing.set(null);
      },
    });
  }

  openReject(id: number): void {
    this.expandedId.set(this.expandedId() === id ? null : id);
    this.rejectNote = '';
  }

  confirmReject(id: number): void {
    this.processing.set(id);
    this.contactService.contactRejectRequest(id, {note: this.rejectNote || null}).subscribe({
      next: (updated) => {
        this.requests.update((list) =>  list.map((r) => (r.id === id ? updated : r)));
        this.expandedId.set(null);
        this.processing.set(null);
        this.notif.success('Solicitud rechazada');
      },
      error: (err) => {
        this.notif.error(getApiErrorDetail(err));
        this.processing.set(null);
      },
    });
  }

  sendInvite(id: number): void {
    this.processing.set(id);
    this.contactService.contactSendInvite(id).subscribe({
      next: (updated) => {
        this.requests.update((list) => list.map((r) => (r.id === id ? updated : r)));
        this.processing.set(null);
        this.notif.success('Invitación enviada');
      },
      error: (err) => {
        this.notif.error(getApiErrorDetail(err));
        this.processing.set(null);
      },
    });
  }

  planLabel(type: string): string {
    return PLAN_LABELS[type] ?? type;
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
