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
  templateUrl: './forgot-password.html',
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
