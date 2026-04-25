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
import { passwordStrengthValidator } from '../../../core/validators/password-strength.validator';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reset-password.html',
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
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(255), passwordStrengthValidator]],
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

  hasUpperCase(): boolean {
    return /[A-Z]/.test(this.form.get('password')?.value ?? '');
  }

  hasSpecialChar(): boolean {
    return /[!@#$%^&*()\-_=+\[\]{};:'",.<>?\/\\|`~]/.test(this.form.get('password')?.value ?? '');
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
