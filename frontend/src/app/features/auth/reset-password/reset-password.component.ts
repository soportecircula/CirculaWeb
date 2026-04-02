import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LoginService } from '../../../../client/services/login.service';
import { NotificationService } from '../../../core/notifications/notification.service';
import { getApiErrorDetail } from '../../../core/notifications/messages';

@Component({
  selector: 'app-reset-password',
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
                <p class="mt-3 fs-15 fw-medium">Plataforma REP</p>
              </div>
            </div>
          </div>
          <div class="row justify-content-center">
            <div class="col-md-8 col-lg-6 col-xl-5">
              <div class="card mt-4 card-bg-fill">
                <div class="card-body p-4">
                  <div class="text-center mt-2">
                    <h5 class="text-primary">Crear nueva contraseña</h5>
                    <p class="text-muted">Tu nueva contraseña debe ser diferente a la anterior.</p>
                  </div>
                  @if (!token()) {
                    <div class="alert alert-danger text-center mx-2" role="alert">
                      <i class="mdi mdi-alert-circle-outline d-block fs-24 mb-2"></i>
                      Token inválido o expirado.
                      <a routerLink="/auth/forgot-password" class="alert-link">Solicita uno nuevo</a>.
                    </div>
                  }
                  @if (successMessage()) {
                    <div class="text-center mx-2">
                      <i class="mdi mdi-check-all d-block fs-24 mb-2 text-success"></i>
                      <p class="text-success">{{ successMessage() }}</p>
                      <a routerLink="/auth/login" class="btn btn-success w-100">Ir al Login</a>
                    </div>
                  }
                  @if (token() && !successMessage()) {
                    <div class="p-2">
                      <form [formGroup]="form" (ngSubmit)="onSubmit()">
                        <div class="mb-3">
                          <label class="form-label" for="password-input">Contraseña</label>
                          <div class="position-relative auth-pass-inputgroup">
                            <input [type]="showPassword() ? 'text' : 'password'"
                              class="form-control pe-5 password-input" id="password-input"
                              formControlName="password" placeholder="Ingresa tu nueva contraseña" maxlength="255">
                            <button class="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon material-shadow-none"
                              type="button" (click)="togglePassword()">
                              <i class="mdi mdi-eye align-middle"
                                [class.mdi-eye-off-outline]="showPassword()"
                                [class.mdi-eye-outline]="!showPassword()"></i>
                            </button>
                          </div>
                          <div class="form-text">Debe tener al menos 8 caracteres.</div>
                        </div>
                        <div class="mb-3">
                          <label class="form-label">Confirmar contraseña</label>
                          <div class="position-relative auth-pass-inputgroup mb-3">
                            <input [type]="showConfirm() ? 'text' : 'password'"
                              class="form-control pe-5 password-input"
                              formControlName="confirmPassword" placeholder="Confirma tu contraseña" maxlength="255">
                            <button class="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon material-shadow-none"
                              type="button" (click)="toggleConfirm()">
                              <i class="mdi mdi-eye align-middle"
                                [class.mdi-eye-off-outline]="showConfirm()"
                                [class.mdi-eye-outline]="!showConfirm()"></i>
                            </button>
                          </div>
                          @if (form.get('confirmPassword')?.touched && form.hasError('passwordMismatch')) {
                            <div class="text-danger fs-12">Las contraseñas no coinciden</div>
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
                            Restablecer Contraseña
                          </button>
                        </div>
                      </form>
                    </div>
                  }
                </div>
              </div>
              <div class="mt-4 text-center">
                <p class="mb-0">Espera, recuerdo mi contraseña...
                  <a routerLink="/auth/login" class="fw-semibold text-primary text-decoration-underline">Clic aquí</a>
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
export class ResetPasswordComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly loginService = inject(LoginService);
  private notif = inject(NotificationService);

  token = signal<string | null>(null);
  showPassword = signal(false);
  showConfirm = signal(false);
  submitting = signal(false);
  successMessage = signal('');
  currentYear = new Date().getFullYear();

  form = this.fb.group(
    {
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(255)]],
      confirmPassword: ['', [Validators.required, Validators.maxLength(255)]],
    },
    { validators: [this.passwordMatchValidator] },
  );

  togglePassword(): void { this.showPassword.update((v) => !v); }
  toggleConfirm(): void { this.showConfirm.update((v) => !v); }

  hasMinLength(): boolean {
    const val = this.form.get('password')?.value ?? '';
    return val.length >= 8;
  }

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    this.token.set(token);
    if (token) {
      void this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { token: null },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    }
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirm = control.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.form.invalid || !this.token()) return;
    this.submitting.set(true);
    this.loginService
      .loginResetPassword({
        token: this.token()!,
        new_password: this.form.value.password!,
      })
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.notif.success('Contraseña restablecida exitosamente.');
          this.successMessage.set('Contraseña restablecida exitosamente.');
        },
        error: (err) => {
          this.submitting.set(false);
          this.notif.error(getApiErrorDetail(err));
        },
      });
  }
}
