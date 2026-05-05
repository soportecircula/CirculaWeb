import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import {
  CuentaConPlan,
  ProducerRead,
  ProducerUpsert,
  TipoProductor,
} from '../../../../client/models';
import { AuthService } from '../../../core/auth/auth.service';
import { COLOMBIA_DEPTOS, getCitiesForDepto } from '../../../core/data/colombia-geo';
import * as RepActions from '../../../store/rep/rep.actions';
import {
  selectMyProducers,
  selectMyProducersLoading,
  selectObligations,
  selectProducerError,
  selectProducerSaving,
  selectSectors,
} from '../../../store/rep/rep.selectors';

@Component({
  selector: 'app-producers',
  imports: [ReactiveFormsModule],
  templateUrl: './producers.html',
  styleUrl: './producers.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Producers {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  private readonly modalService = inject(NgbModal);
  readonly auth = inject(AuthService);

  readonly TipoProductor = TipoProductor;
  readonly CuentaConPlan = CuentaConPlan;
  readonly COLOMBIA_DEPTOS = COLOMBIA_DEPTOS;

  // Store signals
  readonly saving = this.store.selectSignal(selectProducerSaving);
  readonly producerError = this.store.selectSignal(selectProducerError);
  readonly sectors = this.store.selectSignal(selectSectors);
  readonly obligations = this.store.selectSignal(selectObligations);
  readonly myProducers = this.store.selectSignal(selectMyProducers);
  readonly myProducersLoading = this.store.selectSignal(selectMyProducersLoading);
  // First producer for the info cards at top (single-user scenario)
  readonly producer = computed((): ProducerRead | null => this.myProducers()[0] ?? null);

  // Modal mode
  readonly editingProducer = signal<ProducerRead | null>(null);

  // Can the current user add another producer?
  readonly canAddProducer = computed(() => {
    if (this.auth.isSuperAdmin()) return true;
    if (this.auth.planType() === 'demo_col') return true;
    return this.myProducers().length === 0;
  });

  readonly sectorNombre = computed(() => {
    const sectorId = this.producer()?.sector_id;
    if (!sectorId) return null;
    return this.sectors().find((s) => s.id === sectorId)?.nombre ?? null;
  });

  readonly tableRows = computed(() => this.myProducers());

  readonly tableLoading = computed(() => this.myProducersLoading());

  readonly form = this.fb.group({
    sector_id: this.fb.nonNullable.control('', Validators.required),
    razon_social: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(200),
    ]),
    nit: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(30),
    ]),
    ciudad: this.fb.nonNullable.control('', Validators.required),
    departamento: this.fb.nonNullable.control('', Validators.required),
    direccion: this.fb.nonNullable.control('', Validators.required),
    correo: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
    contacto: this.fb.nonNullable.control('', Validators.required),
    nombre_responsable: this.fb.nonNullable.control('', Validators.required),
    tipo: this.fb.nonNullable.control('', Validators.required),
    cuenta_con_plan: this.fb.nonNullable.control('', Validators.required),
    en_incumplimiento_rep: this.fb.nonNullable.control(false),
  });

  private readonly departamentoValue = toSignal(
    this.form.controls.departamento.valueChanges,
    { initialValue: this.form.controls.departamento.value },
  );

  readonly availableCities = computed(() => getCitiesForDepto(this.departamentoValue()));

  readonly selectedObligations = signal<Set<string>>(new Set());

  constructor() {
    this.store.dispatch(RepActions.loadMyProducers());
    this.store.dispatch(RepActions.loadSectors());
    this.store.dispatch(RepActions.loadObligations());

    effect(() => {
      const depto = this.departamentoValue();
      untracked(() => {
        const current = this.form.controls.ciudad.value;
        if (current && !getCitiesForDepto(depto).includes(current)) {
          this.form.controls.ciudad.setValue('', { emitEvent: false });
        }
      });
    });
  }

  openModal(content: TemplateRef<any>, mode: 'add' | 'edit', row?: ProducerRead): void {
    this._resetForm();
    this.editingProducer.set(mode === 'edit' && row ? row : null);

    if (mode === 'edit' && row) {
      this._patchForm(row);
    }

    this.modalService.open(content, { size: 'lg', centered: true });
  }

  private _resetForm(): void {
    this.form.reset({
      en_incumplimiento_rep: false,
      sector_id: '',
      razon_social: '',
      nit: '',
      ciudad: '',
      departamento: '',
      direccion: '',
      correo: '',
      contacto: '',
      nombre_responsable: '',
      tipo: '',
      cuenta_con_plan: '',
    });
    this.selectedObligations.set(new Set());
  }

  private _patchForm(p: ProducerRead): void {
    this.form.patchValue({
      sector_id: p.sector_id ?? '',
      razon_social: p.razon_social,
      nit: p.nit,
      ciudad: p.ciudad ?? '',
      departamento: p.departamento ?? '',
      direccion: p.direccion ?? '',
      correo: p.correo ?? '',
      contacto: p.contacto ?? '',
      nombre_responsable: p.nombre_responsable ?? '',
      tipo: p.tipo ?? '',
      cuenta_con_plan: p.cuenta_con_plan ?? '',
      en_incumplimiento_rep: p.en_incumplimiento_rep ?? false,
    });
    this.selectedObligations.set(new Set(p.obligaciones_normativas ?? []));
  }

  toggleObligation(name: string): void {
    this.selectedObligations.update((set) => {
      const next = new Set(set);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  }

  refreshTable(): void {
    this.store.dispatch(RepActions.loadMyProducers());
  }

  sectorNombreForRow(row: { sector_id?: string | null }): string {
    const id = row.sector_id;
    if (!id) return '—';
    return this.sectors().find((s) => s.id === id)?.nombre ?? id;
  }

  submitProducer(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const upsert: ProducerUpsert = {
      razon_social: v.razon_social,
      nit: v.nit,
      sector_id: v.sector_id.trim() ? v.sector_id : null,
      ciudad: v.ciudad.trim() || null,
      departamento: v.departamento.trim() || null,
      direccion: v.direccion.trim() || null,
      correo: v.correo.trim() || null,
      contacto: v.contacto.trim() || null,
      nombre_responsable: v.nombre_responsable.trim() || null,
      tipo: v.tipo ? (v.tipo as TipoProductor) : null,
      cuenta_con_plan: v.cuenta_con_plan ? (v.cuenta_con_plan as CuentaConPlan) : null,
      en_incumplimiento_rep: v.en_incumplimiento_rep,
      obligaciones_normativas: this.selectedObligations().size > 0
        ? Array.from(this.selectedObligations())
        : null,
    };

    const editId = this.editingProducer()?.id;
    if (editId) {
      this.store.dispatch(RepActions.updateProducerById({ id: editId, data: upsert }));
    } else if (this.auth.isSuperAdmin() || this.auth.planType() === 'demo_col') {
      this.store.dispatch(RepActions.addProducer({ data: upsert }));
    } else {
      this.store.dispatch(RepActions.saveMyProducer({ data: upsert }));
    }
  }

  clearError(): void {
    this.store.dispatch(RepActions.clearProducerError());
  }
}
