import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LoginService } from '../../../../client/services/login.service';
import { NotificationService } from '../../../core/notifications/notification.service';
import { getApiErrorDetail } from '../../../core/notifications/messages';

@Component({
  selector: 'app-forgot-password',
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
                    <h5 class="text-primary">¿Olvidaste tu contraseña?</h5>
                    <p class="text-muted">Restablece tu contraseña con Circula</p>
                    <i class="mdi mdi-email-send-outline display-5 text-success"></i>
                  </div>
                  @if (successMessage()) {
                    <div class="text-center text-success mt-4">{{ successMessage() }}</div>
                  } @else {
                    <div class="alert border-0 alert-warning text-center mb-2 mx-2 mt-4" role="alert">
                      Ingresa tu email y te enviaremos instrucciones para restablecer tu contraseña.
                    </div>
                    <div class="p-2">
                      <form [formGroup]="form" (ngSubmit)="onSubmit()">
                        <div class="mb-4">
                          <label class="form-label">Email</label>
                          <div class="input-group">
                            <span class="input-group-text">&#64;</span>
                            <input type="email" class="form-control" id="email"
                              formControlName="email" placeholder="Ingresa tu email" maxlength="255">
                          </div>
                        </div>
                        <div class="text-center mt-4">
                          <button class="btn btn-success w-100" type="submit"
                            [disabled]="form.invalid || submitting()">
                            @if (submitting()) {
                              <span class="spinner-border spinner-border-sm me-1"></span>
                            }
                            Enviar enlace de recuperación
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
export class ForgotPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly loginService = inject(LoginService);
  private notif = inject(NotificationService);

  submitting = signal(false);
  successMessage = signal('');
  currentYear = new Date().getFullYear();

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
  });

  onSubmit(): void {
    if (this.form.invalid) return;
    this.submitting.set(true);
    const email = this.form.value.email!;
    this.loginService.loginRecoverPassword(email).subscribe({
      next: () => {
        this.submitting.set(false);
        this.notif.success('Se ha enviado un enlace de recuperación a tu email.');
        this.successMessage.set(
          'Se ha enviado un enlace de recuperación a tu email. Revisa tu bandeja de entrada.',
        );
      },
      error: (err) => {
        this.submitting.set(false);
        this.notif.error(getApiErrorDetail(err));
      },
    });
  }
}
