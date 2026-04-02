import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { NotificationService } from '../../../core/notifications/notification.service';
import { getApiErrorDetail } from '../../../core/notifications/messages';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="auth-page-wrapper pt-5">
      <div class="auth-one-bg-position auth-one-bg" id="auth-particles">
        <div class="bg-overlay"></div>
        <div class="shape">
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 1440 120">
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
                    <h5 class="text-primary">Bienvenido</h5>
                    <p class="text-muted">Inicia sesión para continuar.</p>
                  </div>
                  <div class="p-2 mt-4">
                    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                      <div class="mb-3">
                        <label for="email" class="form-label">Email</label>
                        <div class="input-group">
                          <span class="input-group-text">&#64;</span>
                          <input type="email" class="form-control" id="email"
                            formControlName="email" placeholder="Ingresa tu email" maxlength="255">
                        </div>
                      </div>
                      <div class="mb-3">
                        <div class="float-end">
                          <a routerLink="/auth/forgot-password" class="text-muted">¿Olvidaste tu contraseña?</a>
                        </div>
                        <label class="form-label" for="password-input">Contraseña</label>
                        <div class="position-relative auth-pass-inputgroup mb-3">
                          <input [type]="showPassword() ? 'text' : 'password'"
                            class="form-control pe-5 password-input" id="password-input"
                            formControlName="password" placeholder="Ingresa tu contraseña" maxlength="255">
                          <button class="btn btn-icon btn-light position-absolute end-0 top-0 material-shadow-none"
                            type="button" (click)="togglePassword()">
                            @if (showPassword()) {
                              <i class="mdi mdi-eye-outline"></i>
                            } @else {
                              <i class="mdi mdi-eye-off-outline"></i>
                            }
                          </button>
                        </div>
                      </div>
                      <div class="mt-4">
                        <button class="btn btn-success w-100" type="submit"
                          [disabled]="loginForm.invalid || submitting()">
                          @if (submitting()) {
                            <span class="spinner-border spinner-border-sm me-1"></span>
                          }
                          Iniciar Sesión
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div class="mt-4 text-center">
                <p class="mb-0">¿No tienes cuenta?
                  <a routerLink="/auth/register" class="fw-semibold text-primary text-decoration-underline">Regístrate</a>
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
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notif = inject(NotificationService);

  showPassword = signal(false);
  submitting = signal(false);
  currentYear = new Date().getFullYear();

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
    password: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]],
  });

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.submitting.set(true);

    const { email, password } = this.loginForm.value;
    this.auth.login(email!, password!).subscribe({
      next: () => {
        this.submitting.set(false);
        setTimeout(() => {
          this.router.navigateByUrl(this.auth.getDefaultRedirectPath());
        }, 300);
      },
      error: (err) => {
        this.submitting.set(false);
        this.notif.error(getApiErrorDetail(err));
      },
    });
  }
}
