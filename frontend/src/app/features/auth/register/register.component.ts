import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { UsersService } from '../../../../client/services/users.service';
import { NotificationService } from '../../../core/notifications/notification.service';
import { getApiErrorDetail } from '../../../core/notifications/messages';
import { InviteTokenInfo } from '../../../../client/models';
import { passwordStrengthValidator } from '../../../core/validators/password-strength.validator';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './register.html',
})
export class RegisterComponent implements OnInit{
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly usersService = inject(UsersService);
  private readonly route = inject(ActivatedRoute);
  private notif = inject(NotificationService);

  showPassword = signal(false);
  showConfirmPassword = signal(false);
  submitting = signal(false);
  successMessage = signal('');
  currentYear = new Date().getFullYear();
  inviteToken = signal<string | null>(null);
  inviteInfo = signal<InviteTokenInfo | null>(null);
  tokenError = signal('');
  isInvitedMode = computed(() => !!this.inviteToken());

  form = this.fb.group(
    {
      fullName: ['', [Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      company: ['', [Validators.maxLength(100)]],
      nit: ['', [Validators.maxLength(30)]],
      phone: ['', [Validators.maxLength(20)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(255), passwordStrengthValidator]],
      confirmPassword: ['', [Validators.required, Validators.maxLength(255)]],
      dataConsent: [false, [Validators.requiredTrue]],
    },
    { validators: [this.passwordMatchValidator] },
  );

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if(!token) return;
    this.inviteToken.set(token);

    //Limpiar token de la URL
    void this.router.navigate([],{
      relativeTo: this.route,
      queryParams: { token: null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    })

    //Hacer requeridos los campos extra
    this.form.get('company')!.setValidators([Validators.required, Validators.minLength(2), Validators.maxLength(100)]);
    this.form.get('company')!.updateValueAndValidity();
    this.form.get('nit')!.setValidators([Validators.required, Validators.minLength(5), Validators.maxLength(30)]);
    this.form.get('nit')!.updateValueAndValidity();
    this.form.get('phone')!.setValidators([Validators.required, Validators.minLength(7), Validators.maxLength(20)]);
    this.form.get('phone')!.updateValueAndValidity();

    this.usersService.usersGetInviteInfo(token).subscribe({
      next: (info) => {
        this.inviteInfo.set(info);
        this.form.patchValue({ email: info.email, company: info.company, phone: info.phone ?? '' });
        this.form.get('email')!.disable();
      },
      error: (err) => this.tokenError.set(getApiErrorDetail(err) || 'El enlace de invitación es inválido o ha expirado.'),
    });
  }

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword.update((v) => !v);
  }

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

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirm = control.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.submitting.set(true);
    const v = this.form.getRawValue();
    const obs = this.isInvitedMode() ? this.usersService.usersRegisterWithInvite({
      invite_token: this.inviteToken()!,
      email: v.email!,
      password: v.password!,
      full_name: v.fullName ?? '',
      company: v.company!,
      nit: v.nit!,
      phone: v.phone!,
    }): this.usersService.usersRegisterUser({
      email: v.email!, password: v.password!, full_name: v.fullName || undefined,
    });

    obs.subscribe({
      next: () => {
        this.submitting.set(false);
        this.notif.success('Cuenta creada exitosamente.');
        this.successMessage.set('Cuenta creada exitosamente.');
      },
      error: (err) => {
        this.submitting.set(false);
        this.notif.error(getApiErrorDetail(err));
      }
    })
  }
}
