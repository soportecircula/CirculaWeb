import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, take } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { getAccessToken } from '../../../core/auth/auth-token';
import { NotificationService } from '../../../core/notifications/notification.service';
import { getApiErrorDetail } from '../../../core/notifications/messages';
import { selectAuthInitialized } from '../../../store/Authentication/authentication.selectors';
import { INACTIVITY_FLAG } from '../../../core/auth/inactivity.service';

const REMEMBER_ME_KEY = 'circula_remember_email';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.html',
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notif = inject(NotificationService);
  private readonly store = inject(Store);

  showPassword = signal(false);
  submitting = signal(false);
  rememberMe = signal(false);
  blocked = signal(false);
  blockMessage = signal('');
  sessionExpired = signal(false);
  currentYear = new Date().getFullYear();

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
    password: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]],
  });

  ngOnInit(): void {
    if (sessionStorage.getItem(INACTIVITY_FLAG)) {
      sessionStorage.removeItem(INACTIVITY_FLAG);
      this.sessionExpired.set(true);
    }

    const saved = localStorage.getItem(REMEMBER_ME_KEY);
    if (saved) {
      this.rememberMe.set(true);
      this.loginForm.patchValue({ email: saved });
    }

    // Si hay token en memoria (sesión activa en la misma pestaña), redirigir de inmediato
    if (getAccessToken()) {
      void this.router.navigateByUrl(this.auth.getDefaultRedirectPath());
      return;
    }

    // Esperar a que el refresh JWT inicial complete y redirigir si resultó autenticado
    this.store
      .select(selectAuthInitialized)
      .pipe(
        filter((init) => init),
        take(1),
      )
      .subscribe(() => {
        if (getAccessToken()) {
          void this.router.navigateByUrl(this.auth.getDefaultRedirectPath());
        }
      });
  }

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  toggleRememberMe(): void {
    this.rememberMe.update((v) => !v);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.submitting.set(true);
    this.blocked.set(false);

    const { email, password } = this.loginForm.value;

    if (this.rememberMe()) {
      localStorage.setItem(REMEMBER_ME_KEY, email!);
    } else {
      localStorage.removeItem(REMEMBER_ME_KEY);
    }

    this.auth.login(email!, password!, false).subscribe({
      next: () => {
        this.submitting.set(false);
        setTimeout(() => this.router.navigateByUrl(this.auth.getDefaultRedirectPath()), 300);
      },
      error: (err) => {
        this.submitting.set(false);
        const detail = getApiErrorDetail(err);
        if (err?.status === 429 || detail?.toLowerCase().includes('bloqueada')) {
          this.blocked.set(true);
          this.blockMessage.set(detail || 'Cuenta bloqueada temporalmente. Inténtalo más tarde.');
        } else {
          this.notif.error(detail);
        }
      },
    });
  }
}
