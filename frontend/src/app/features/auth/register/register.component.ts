import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsersService } from '../../../../client/services/users.service';
import { NotificationService } from '../../../core/notifications/notification.service';
import { getApiErrorDetail } from '../../../core/notifications/messages';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="auth-page-wrapper pt-5">
      <div class="auth-one-bg-position auth-one-bg" id="auth-particles">
        <div class="bg-overlay"></div>
        <div class="shape">
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1440 120">
            <path d="M 0,36 C 144,53.6 432,123.2 720,124 C 1008,124.8 1296,56.8 1440,40L1440 140L0 140z"></path>
          </svg>
        </div>
      </div>
      <div class="auth-page-content">
        <div class="container">
          <div class="row">
            <div class="col-lg-12">
              <div class="text-center mt-sm-5 mb-4 text-white-50">
                <div>
                  <a routerLink="/" class="d-inline-block auth-logo">
                    <h2 class="text-white mb-0">Circula</h2>
                  </a>
                </div>
                <p class="mt-3 fs-15 fw-medium">Plataforma REP — Responsabilidad Extendida del Productor</p>
              </div>
            </div>
          </div>
          <div class="row justify-content-center">
            <div class="col-md-8 col-lg-6 col-xl-5">
              <div class="card mt-4 card-bg-fill">
                <div class="card-body p-4">
                  <div class="text-center mt-2">
                    <h5 class="text-primary">Crear Nueva Cuenta</h5>
                    <p class="text-muted">Regístrate para obtener tu cuenta</p>
                  </div>
                  <div class="p-2 mt-4">
                    @if (successMessage()) {
                      <div class="text-center text-success">{{ successMessage() }}</div>
                    }
                    @if (!successMessage()) {
                      <form [formGroup]="form" (ngSubmit)="onSubmit()">
                        <div class="mb-3">
                          <label for="useremail" class="form-label">Email <span class="text-danger">*</span></label>
                          <div class="input-group">
                            <span class="input-group-text">&#64;</span>
                            <input type="email" class="form-control" id="useremail"
                              formControlName="email" placeholder="Ingresa tu email" maxlength="255">
                          </div>
                        </div>
                        <div class="mb-3">
                          <label for="fullname" class="form-label">Nombre completo</label>
                          <input type="text" class="form-control" id="fullname"
                            formControlName="fullName" placeholder="Ingresa tu nombre" maxlength="50">
                        </div>
                        <div class="mb-3">
                          <label for="userpassword" class="form-label">Contraseña <span class="text-danger">*</span></label>
                          <div class="position-relative auth-pass-inputgroup">
                            <input [type]="showPassword() ? 'text' : 'password'"
                              class="form-control pe-5 password-input" id="userpassword"
                              formControlName="password" placeholder="Ingresa tu contraseña" maxlength="255">
                            <button class="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon material-shadow-none"
                              type="button" (click)="togglePassword()">
                              <i class="mdi mdi-eye align-middle"
                                [class.mdi-eye-off-outline]="showPassword()"
                                [class.mdi-eye-outline]="!showPassword()"></i>
                            </button>
                          </div>
                        </div>
                        <div class="mb-3">
                          <label for="confirm-password" class="form-label">Confirmar contraseña <span class="text-danger">*</span></label>
                          <input [type]="showPassword() ? 'text' : 'password'"
                            class="form-control password-input" id="confirm-password"
                            formControlName="confirmPassword" placeholder="Confirma tu contraseña" maxlength="255">
                          @if (form.get('confirmPassword')?.touched && form.hasError('passwordMismatch')) {
                            <div class="text-danger mt-1 fs-12">Las contraseñas no coinciden</div>
                          }
                        </div>
                        <div id="password-contain" class="p-3 bg-light mb-2 rounded">
                          <h5 class="fs-13">La contraseña debe contener:</h5>
                          <p class="fs-12 mb-2" [class.text-success]="hasMinLength()" [class.text-danger]="!hasMinLength()">
                            {{ hasMinLength() ? '✔' : '✖' }} Mínimo <b>8 caracteres</b>
                          </p>
                        </div>
                        <div class="mt-4">
                          <button class="btn btn-success w-100" type="submit"
                            [disabled]="form.invalid || submitting()">
                            @if (submitting()) {
                              <span class="spinner-border spinner-border-sm me-1"></span>
                            }
                            Crear Cuenta
                          </button>
                        </div>
                      </form>
                    }
                  </div>
                </div>
              </div>
              <div class="mt-4 text-center">
                <p class="mb-0">¿Ya tienes cuenta?
                  <a routerLink="/auth/login" class="fw-semibold text-primary text-decoration-underline">Iniciar Sesión</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer class="footer">
        <div class="container">
          <div class="row">
            <div class="col-lg-12">
              <div class="text-center">
                <p class="mb-0 text-muted">&copy; {{ currentYear }} Circula Colombia S.A.S.</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `,
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly usersService = inject(UsersService);
  private notif = inject(NotificationService);

  showPassword = signal(false);
  submitting = signal(false);
  successMessage = signal('');
  currentYear = new Date().getFullYear();

  form = this.fb.group(
    {
      fullName: ['', [Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(255)]],
      confirmPassword: ['', [Validators.required, Validators.maxLength(255)]],
    },
    { validators: [this.passwordMatchValidator] },
  );

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  hasMinLength(): boolean {
    const val = this.form.get('password')?.value ?? '';
    return val.length >= 8;
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirm = control.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.submitting.set(true);
    const { email, password, fullName } = this.form.value;
    this.usersService
      .usersRegisterUser({
        email: email!,
        password: password!,
        full_name: fullName || undefined,
      })
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.notif.success('Cuenta creada exitosamente. Ahora puedes iniciar sesión.');
          this.successMessage.set('Cuenta creada exitosamente. Redirigiendo al login...');
          setTimeout(() => this.router.navigate(['/auth/login']), 3000);
        },
        error: (err) => {
          this.submitting.set(false);
          this.notif.error(getApiErrorDetail(err));
        },
      });
  }
}
