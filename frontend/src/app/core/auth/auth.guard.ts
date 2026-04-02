import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, map, take } from 'rxjs';
import { selectAuthInitialized } from '../../store/Authentication/authentication.selectors';
import { getAccessToken } from './auth-token';

export const authGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  if (getAccessToken()) {
    return true;
  }

  return store.select(selectAuthInitialized).pipe(
    filter((init) => init),
    take(1),
    map(() => {
      if (getAccessToken()) return true;
      return router.createUrlTree(['/auth/login']);
    }),
  );
};
