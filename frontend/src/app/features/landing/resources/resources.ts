import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './resources.html',
  styleUrl: './resources.scss',
})
export class Resources {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  readonly loading = signal(false);
  readonly submitted = signal(false);
  readonly success = signal(false);
  readonly errorMsg = signal<string | null>(null);

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    company: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    requirement_type: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern(/^\d{7,15}$/)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', Validators.maxLength(500)],
  });

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

  onSubmit(): void {
    this.submitted.set(true);
    if (this.form.invalid) return;

    this.loading.set(true);
    this.errorMsg.set(null);

    this.http.post('/api/v1/contact/submit', this.form.value).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set(true);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMsg.set(err?.error?.detail ?? 'Ocurrió un error. Por favor intenta de nuevo.');
      },
    });
  }
}
