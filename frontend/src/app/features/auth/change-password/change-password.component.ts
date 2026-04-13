import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UsersService } from '../../../../client/services/users.service';
import { NotificationService } from '../../../core/notifications/notification.service';
import { getApiErrorDetail } from '../../../core/notifications/messages';

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="page-title-box d-sm-flex align-items-center justify-content-between">
            <h4 class="mb-sm-0">Cambiar Contraseña</h4>
            <div class="page-title-right">
              <ol class="breadcrumb m-0">
                <li class="breadcrumb-item"><a routerLink="/dashboard">Dashboard</a></li>
                <li class="breadcrumb-item active">Cambiar Contraseña</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col-xxl-6 col-lg-8">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">
                <i class="mdi mdi-lock-reset align-bottom me-1"></i> Actualizar Contraseña
              </h5>
            </div>
            <div class="card-body">
              @if (successMessage()) {
                <div class="text-success mb-3">
                  <i class="mdi mdi-check-all me-2 align-middle"></i>
                  {{ successMessage() }}
                </div>
              }
              <form [formGroup]="form" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label class="form-label" for="currentPassword">Contraseña actual</label>
                  <div class="position-relative auth-pass-inputgroup">
                    <input [type]="showCurrentPassword() ? 'text' : 'password'"
                      class="form-control pe-5 password-input" id="currentPassword"
                      formControlName="currentPassword" placeholder="Ingresa tu contraseña actual" maxlength="255">
                    <button class="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon material-shadow-none"
                      type="button" (click)="toggleCurrentPassword()">
                      <i class="mdi align-middle"
                        [class.mdi-eye-outline]="showCurrentPassword()"
                        [class.mdi-eye-off-outline]="!showCurrentPassword()"></i>
                    </button>
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label" for="newPassword">Nueva contraseña</label>
                  <div class="position-relative auth-pass-inputgroup">
                    <input [type]="showNewPassword() ? 'text' : 'password'"
                      class="form-control pe-5 password-input" id="newPassword"
                      formControlName="newPassword" placeholder="Ingresa tu nueva contraseña" maxlength="255">
                    <button class="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon material-shadow-none"
                      type="button" (click)="toggleNewPassword()">
                      <i class="mdi align-middle"
                        [class.mdi-eye-outline]="showNewPassword()"
                        [class.mdi-eye-off-outline]="!showNewPassword()"></i>
                    </button>
                  </div>
                  <div class="form-text">Debe tener al menos 8 caracteres.</div>
                </div>
                <div class="mb-3">
                  <label class="form-label" for="confirmPassword">Confirmar nueva contraseña</label>
                  <div class="position-relative auth-pass-inputgroup">
                    <input [type]="showNewPassword() ? 'text' : 'password'"
                      class="form-control pe-5 password-input" id="confirmPassword"
                      formControlName="confirmPassword" placeholder="Confirma tu nueva contraseña" maxlength="255">
                  </div>
                  @if (form.get('confirmPassword')?.touched && form.hasError('passwordMismatch')) {
                    <div class="text-danger mt-1 fs-12">Las contraseñas no coinciden</div>
                  }
                </div>
                <div id="password-contain" class="p-3 bg-light mb-3 rounded">
                  <h5 class="fs-13">La contraseña debe contener:</h5>
                  <p class="fs-12 mb-0" [class.text-success]="hasMinLength()" [class.text-danger]="!hasMinLength()">
                    {{ hasMinLength() ? '✔' : '✖' }} Mínimo <b>8 caracteres</b>
                  </p>
                </div>
                <div class="d-flex gap-2">
                  <button class="btn btn-success" type="submit"
                    [disabled]="form.invalid || submitting()">
                    @if (submitting()) {
                      <span class="spinner-border spinner-border-sm me-1"></span>
                    }
                    <i class="mdi mdi-lock-reset align-bottom me-1"></i> Cambiar Contraseña
                  </button>
                  <a routerLink="/dashboard" class="btn btn-soft-danger">Cancelar</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ChangePasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly usersService = inject(UsersService);
  private notif = inject(NotificationService);

  showCurrentPassword = signal(false);
  showNewPassword = signal(false);
  submitting = signal(false);
  successMessage = signal('');

  toggleCurrentPassword(): void { this.showCurrentPassword.update((v) => !v); }
  toggleNewPassword(): void { this.showNewPassword.update((v) => !v); }

  hasMinLength(): boolean {
    const val = this.form.get('newPassword')?.value ?? '';
    return val.length >= 8;
  }

  form = this.fb.group(
    {
      currentPassword: ['', [Validators.required, Validators.maxLength(255)]],
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(255)]],
      confirmPassword: ['', [Validators.required, Validators.maxLength(255)]],
    },
    { validators: [this.passwordMatchValidator] },
  );

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('newPassword')?.value;
    const confirm = control.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.submitting.set(true);
    this.usersService
      .usersUpdatePasswordMe({
        current_password: this.form.value.currentPassword!,
        new_password: this.form.value.newPassword!,
      })
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.notif.success('Contraseña actualizada exitosamente.');
          this.successMessage.set('Contraseña actualizada exitosamente.');
          this.form.reset();
        },
        error: (err) => {
          this.submitting.set(false);
          this.notif.error(getApiErrorDetail(err));
        },
      });
  }
}
