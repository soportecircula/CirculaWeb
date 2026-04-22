import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ContactService } from '../../../../client/services/contact.service';
import { AvailableSlot } from '../../../../client/models';
import { Calendar } from '../../../layouts/calendar/calendar';

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, NgIf, Calendar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './resources.html',
})
export class Resources implements OnInit {
  private fb = inject(FormBuilder);
  private contactService = inject(ContactService);

  readonly loading = signal(false);
  readonly submitted = signal(false);
  readonly success = signal(false);
  readonly errorMsg = signal<string | null>(null);
  readonly showCalendar = signal(false);
  readonly selectedSlot = signal<AvailableSlot | null>(null);

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    company: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    requirement_type: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern(/^\d{7,15}$/)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', Validators.maxLength(500)],
    scheduled_at: [null as string | null],
  });

  get currentRequirementType(): string {
    return this.form.get('requirement_type')?.value ?? '';
  }

  ngOnInit(): void {
    this.form.get('requirement_type')?.valueChanges.subscribe(() => {
      this.clearSlot();
      this.showCalendar.set(false);
    });
  }

  get messageLength(): number {
    return this.form.get('message')?.value?.length ?? 0;
  }

  hasError(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && (ctrl.touched || this.submitted()));
  }

  getError(field: string): string {
    const errors = this.form.get(field)?.errors;
    if (!errors) return '';
    if (errors['required']) return 'Este campo es requerido.';
    if (errors['minlength']) return `Mínimo ${errors['minlength'].requiredLength} caracteres.`;
    if (errors['maxlength']) return `Máximo ${errors['maxlength'].requiredLength} caracteres.`;
    if (errors['email']) return 'Ingresa un correo electrónico válido.';
    if (errors['pattern']) return 'Solo se permiten dígitos (7–15 números).';
    return '';
  }

  openCalendar(): void { this.showCalendar.set(true); }

  onSlotConfirmed(slot: AvailableSlot): void {
    this.selectedSlot.set(slot);
    this.form.get('scheduled_at')?.setValue(slot.datetime_iso);
    this.showCalendar.set(false);
  }

  onCalendarClose(): void { this.showCalendar.set(false); }

  clearSlot(): void {
    this.selectedSlot.set(null);
    this.form.get('scheduled_at')?.setValue(null);
  }

  onSubmit(): void {
    this.submitted.set(true);
    if (this.form.invalid) return;

    this.loading.set(true);
    this.errorMsg.set(null);

    this.contactService.contactSubmitContactForm(this.form.value as any).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set(true);
      },
      error: (err: any) => {
        this.loading.set(false);
        this.errorMsg.set(err?.error?.detail ?? 'Ocurrió un error. Por favor intenta de nuevo.');
      },
    });
  }
}
