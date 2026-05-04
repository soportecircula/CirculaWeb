import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as ContactActions from '../../../store/Contact/contact.actions';
import { selectProcessingId, selectRequestItems, selectRequestsLoading } from '../../../store/Contact/contact.selectors';

const PLAN_LABELS: Record<string, string> = {
  demo_rep: 'Diagnóstico REP / Productores',
  demo_indv: 'Plan Individual',
  demo_col: 'Plan Colectivo',
  demo_esg: 'Infraestructura ESG',
  support: 'Soporte',
  info: 'Información',
};

@Component({
  selector: 'app-pending-requests',
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pending-requests.html',
})
export class PendingRequests implements OnInit {
  private readonly store = inject(Store);

  readonly requests = this.store.selectSignal(selectRequestItems);
  readonly loading = this.store.selectSignal(selectRequestsLoading);
  readonly processing = this.store.selectSignal(selectProcessingId);

  expandedId = signal<number | null>(null);
  rejectNote = '';

  activeFilter = signal<'all' | 'productores' | 'planes'>('all');

  filteredRequests = computed(() => {
    const filter = this.activeFilter();
    const all = this.requests();
    if (filter === 'productores') return all.filter((r) => r.requirement_type === 'demo_rep');
    if (filter === 'planes')
      return all.filter(
        (r) => r.requirement_type === 'demo_indv' || r.requirement_type === 'demo_col',
      );
    return all;
  });

  setFilter(filter: 'all' | 'productores' | 'planes'): void {
    this.activeFilter.set(filter);
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.store.dispatch(ContactActions.loadRequests());
  }

  approve(id: number): void {
    this.store.dispatch(ContactActions.approveRequest({ id }));
  }

  openReject(id: number): void {
    this.expandedId.set(this.expandedId() === id ? null : id);
    this.rejectNote =
      'Agradecemos su interés. Tras evaluar su solicitud, lamentamos informarle que en esta ocasión no ha sido aprobada.';
  }

  confirmReject(id: number): void {
    this.store.dispatch(ContactActions.rejectRequest({ id, note: this.rejectNote || null }));
    this.expandedId.set(null);
  }

  sendInvite(id: number): void {
    this.store.dispatch(ContactActions.sendInvite({ id }));
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
