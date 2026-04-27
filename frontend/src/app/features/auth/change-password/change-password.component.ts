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
import { passwordStrengthValidator } from '../../../core/validators/password-strength.validator';

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './change-password.html',
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

  hasUpperCase(): boolean {
    return /[A-Z]/.test(this.form.get('newPassword')?.value ?? '');
  }

  hasSpecialChar(): boolean {
    return /[!@#$%^&*()\-_=+\[\]{};:'",.<>?\/\\|`~]/.test(this.form.get('newPassword')?.value ?? '');
  }

  form = this.fb.group(
    {
      currentPassword: ['', [Validators.required, Validators.maxLength(255)]],
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(255), passwordStrengthValidator]],
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
