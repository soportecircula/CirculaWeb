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
  templateUrl: './profile.html',
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
