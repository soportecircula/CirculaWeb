import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from '../../../core/auth/auth.service';
import { NotificationService } from '../../../core/notifications/notification.service';
import { getApiErrorDetail } from '../../../core/notifications/messages';
import { avatarUrl } from '../../../core/utils/image-url';
import { UsersService } from '../../../../client/services';
import * as AuthActions from '../../../store/Authentication/authentication.actions';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="row">
      <div class="col-12">
        <div class="page-title-box d-sm-flex align-items-center justify-content-between">
          <h4 class="mb-sm-0">Mi Perfil</h4>
          <div class="page-title-right">
            <a routerLink="/dashboard/change-password" class="btn btn-soft-primary btn-sm">
              <i class="mdi mdi-lock-reset me-1"></i> Cambiar Contraseña
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-12 col-lg-6">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0"><i class="mdi mdi-account-outline me-1"></i> Datos personales</h5>
          </div>
          <div class="card-body">
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <div class="input-group">
                  <span class="input-group-text">&#64;</span>
                  <input id="email" type="email" class="form-control" formControlName="email" maxlength="255">
                </div>
              </div>
              <div class="mb-3">
                <label for="full_name" class="form-label">Nombre completo</label>
                <input id="full_name" type="text" class="form-control" formControlName="full_name" maxlength="50">
              </div>
              <div class="d-flex gap-2">
                <button type="submit" class="btn btn-primary"
                  [disabled]="form.invalid || submitting()">
                  @if (submitting()) {
                    <span class="spinner-border spinner-border-sm me-1"></span>
                  }
                  Guardar
                </button>
                <a routerLink="/dashboard" class="btn btn-light">Volver</a>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div class="col-12 col-lg-6">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0"><i class="mdi mdi-information-outline me-1"></i> Información</h5>
          </div>
          <div class="card-body">
            <div class="d-flex align-items-center mb-3">
              <div class="me-3">
                <img [src]="avatarUrl(auth.user()?.avatar_url)"
                  [alt]="form.get('full_name')?.value || ''"
                  class="rounded-circle avatar-lg"
                  (error)="$any($event.target).src=avatarUrl(null)">
              </div>
              <div>
                <h5 class="mb-1">{{ form.get('full_name')?.value || 'Sin nombre' }}</h5>
                <p class="text-muted mb-0">{{ form.get('email')?.value }}</p>
                <span class="badge"
                  [class.bg-primary]="auth.isSuperAdmin()"
                  [class.bg-info-subtle]="!auth.isSuperAdmin()"
                  [class.text-info]="!auth.isSuperAdmin()">
                  {{ auth.isSuperAdmin() ? 'Super Admin' : 'Usuario' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ProfileComponent implements OnInit {
  readonly auth = inject(AuthService);
  private usersService = inject(UsersService);
  private store = inject(Store);
  private notif = inject(NotificationService);
  private fb = inject(FormBuilder);

  submitting = signal(false);
  protected avatarUrl = avatarUrl;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
    full_name: ['', [Validators.maxLength(50)]],
  });

  ngOnInit(): void {
    const u = this.auth.user();
    if (u) {
      this.form.patchValue({
        email: u.email ?? '',
        full_name: u.full_name ?? '',
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.submitting.set(true);
    const data = this.form.getRawValue();
    this.usersService.usersUpdateUserMe({
      email: data.email!,
      full_name: data.full_name || null,
    }).subscribe({
      next: (updatedUser) => {
        this.submitting.set(false);
        this.notif.success('Perfil actualizado');
        this.store.dispatch(AuthActions.updateUserFromProfile({ user: updatedUser }));
      },
      error: (err) => {
        this.submitting.set(false);
        this.notif.error(getApiErrorDetail(err));
      },
    });
  }
}
