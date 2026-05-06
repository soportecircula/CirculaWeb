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
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { Actions, ofType } from '@ngrx/effects';
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
  imports: [ReactiveFormsModule, NgbTooltip],
  templateUrl: './producers.html',
  styleUrl: './producers.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Producers {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  private readonly modalService = inject(NgbModal);
  private readonly actions$ = inject(Actions);
  private modalRef: NgbModalRef | null = null;
  readonly auth = inject(AuthService);

  readonly TipoProductor = TipoProductor;
  readonly CuentaConPlan = CuentaConPlan;
  readonly COLOMBIA_DEPTOS = COLOMBIA_DEPTOS;
  readonly OTRO_SECTOR_ID = '__otro__';

  // Store signals
  readonly saving = this.store.selectSignal(selectProducerSaving);
  readonly producerError = this.store.selectSignal(selectProducerError);
  readonly sectors = this.store.selectSignal(selectSectors);
  readonly obligations = this.store.selectSignal(selectObligations);
  readonly myProducers = this.store.selectSignal(selectMyProducers);
  readonly myProducersLoading = this.store.selectSignal(selectMyProducersLoading);
  // Producer shown in the info cards — updated when user clicks a table row
  readonly producer = signal<ProducerRead | null>(null);

  // Modal mode
  readonly editingProducer = signal<ProducerRead | null>(null);

  // Can the current user add another producer?
  readonly canAddProducer = computed(() => {
    if (this.auth.isSuperAdmin()) return true;
    if (this.auth.planType() === 'demo_col') return true;
    return this.myProducers().length === 0;
  });

  readonly sectorNombre = computed(() => {
    const p = this.producer();
    if(!p) return null;
    if (p.sector_id) return this.sectors().find((s)=> s.id === p.sector_id)?.nombre ?? null;
    return p.other_sector ?? null;
  });

  readonly tableRows = computed(() => this.myProducers());

  readonly tableLoading = computed(() => this.myProducersLoading());

  readonly isFormReady = computed(() => {
    if (this.formStatus() !== 'VALID') return false;
    if (this.obligations().length > 0 && this.selectedObligations().size === 0) return false;
    return true;
  });

  readonly form = this.fb.group({
    sector_id: this.fb.nonNullable.control('', Validators.required),
    otro_sector_nombre: this.fb.nonNullable.control(''),
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
    contacto: this.fb.nonNullable.control('', [Validators.required, Validators.pattern(/^\d+$/)]),
    nombre_responsable: this.fb.nonNullable.control('', Validators.required),
    tipo: this.fb.nonNullable.control('', Validators.required),
    cuenta_con_plan: this.fb.nonNullable.control('', Validators.required),
    en_incumplimiento_rep: this.fb.nonNullable.control(false),
  });

  private readonly departamentoValue = toSignal(
    this.form.controls.departamento.valueChanges,
    { initialValue: this.form.controls.departamento.value },
  );

  private readonly sectorIdValue = toSignal(
    this.form.controls.sector_id.valueChanges,
    { initialValue: this.form.controls.sector_id.value },
  );

  private readonly formStatus = toSignal(this.form.statusChanges, {
    initialValue: this.form.status,
  });

  readonly availableCities = computed(() => getCitiesForDepto(this.departamentoValue()));
  readonly isOtroSelected = computed(() => this.sectorIdValue() === this.OTRO_SECTOR_ID);

  readonly selectedObligations = signal<Set<string>>(new Set());

  constructor() {
    this.store.dispatch(RepActions.loadMyProducers());
    this.store.dispatch(RepActions.loadSectors());
    this.store.dispatch(RepActions.loadObligations());

    this.actions$.pipe(
      ofType(
        RepActions.saveMyProducerSuccess,
        RepActions.addProducerSuccess,
        RepActions.updateProducerByIdSuccess,
      ),
      takeUntilDestroyed(),
    ).subscribe(({ producer }) => {
      this._resetForm();
      this.modalRef?.close();
      this.modalRef = null;
      this.producer.set(producer);
    });

    effect(() => {
      const producers = this.myProducers();
      untracked(() => {
        if (this.producer() === null && producers.length > 0) {
          this.producer.set(producers[0]);
        }
      });
    });

    effect(() => {
      const depto = this.departamentoValue();
      untracked(() => {
        const current = this.form.controls.ciudad.value;
        if (current && !getCitiesForDepto(depto).includes(current)) {
          this.form.controls.ciudad.setValue('', { emitEvent: false });
        }
      });
    });

    effect(() => {
      const isOtro = this.isOtroSelected();
      untracked(() => {
        const ctrl = this.form.controls.otro_sector_nombre;
        if (isOtro) {
          ctrl.setValidators([
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(100),
          ]);
        } else {
          ctrl.clearValidators();
          ctrl.setValue('');
        }
        ctrl.updateValueAndValidity();
      });
    });
  }

  openModal(content: TemplateRef<any>, mode: 'add' | 'edit', row?: ProducerRead): void {
    this._resetForm();
    this.editingProducer.set(mode === 'edit' && row ? row : null);

    if (mode === 'edit' && row) {
      this._patchForm(row);
    }

    this.modalRef = this.modalService.open(content, { size: 'lg', centered: true });
  }

  private _resetForm(): void {
    this.form.reset({
      en_incumplimiento_rep: false,
      sector_id: '',
      otro_sector_nombre: '',
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
      sector_id: p.other_sector ? this.OTRO_SECTOR_ID : (p.sector_id ?? ''),
      otro_sector_nombre: p.other_sector ?? '',
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
    this.selectedObligations.set(new Set((p.obligaciones_normativas ?? []).map(o => o.id)));
  }

  toggleObligation(id: string): void {
    this.selectedObligations.update((set) => {
      const next = new Set(set);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  selectProducer(row: ProducerRead): void {
    this.producer.set(row);
  }

  refreshTable(): void {
    this.store.dispatch(RepActions.loadMyProducers());
  }

  sectorNombreForRow(row: ProducerRead): string {
    if(row.sector_id) return this.sectors().find((s)=> s.id === row.sector_id)?.nombre ?? '-';
    return row.other_sector ?? '-';
  }

  async submitProducer(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();

    const sectorId = this.isOtroSelected() ? null : (v.sector_id.trim() ||null);

    const sectorOtro = this.isOtroSelected() ? v.otro_sector_nombre.trim() || null : null;


    const upsert: ProducerUpsert = {
      razon_social: v.razon_social,
      nit: v.nit,
      sector_id: sectorId,
      other_sector: sectorOtro,
      ciudad: v.ciudad.trim() || null,
      departamento: v.departamento.trim() || null,
      direccion: v.direccion.trim() || null,
      correo: v.correo.trim() || null,
      contacto: v.contacto.trim() || null,
      nombre_responsable: v.nombre_responsable.trim() || null,
      tipo: v.tipo ? (v.tipo as TipoProductor) : null,
      cuenta_con_plan: v.cuenta_con_plan ? (v.cuenta_con_plan as CuentaConPlan) : null,
      en_incumplimiento_rep: v.en_incumplimiento_rep,
      obligation_ids: Array.from(this.selectedObligations()),
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

  hasError(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl.touched);
  }

  getError(field: string): string {
    const errors = this.form.get(field)?.errors;
    if (!errors) return '';
    if (errors['required']) return 'Este campo es obligatorio.';
    if (errors['minlength']) return `Mínimo ${errors['minlength'].requiredLength} caracteres.`;
    if (errors['maxlength']) return `Máximo ${errors['maxlength'].requiredLength} caracteres.`;
    if (errors['email']) return 'Ingresa un correo electrónico válido.';
    if (errors['pattern']) return 'Solo se permiten números.';
    return '';
  }
}
