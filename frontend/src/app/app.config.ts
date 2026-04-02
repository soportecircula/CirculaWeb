import { ApplicationConfig, isDevMode, provideBrowserGlobalErrorListeners } from '@angular/core';
import { LOCALE_ID } from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { RefreshInterceptor } from './core/auth/refresh.interceptor';
import { AuthClientInterceptor } from './core/auth/auth.interceptor';
import { provideDefaultClient } from '../client/providers';
import { environment } from '../environments/environment';
import { rootReducer } from './store';
import { AuthenticationEffects } from './store/Authentication/authentication.effects';
import { LayoutEffects } from './store/Layout/layout.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'es-CO' },
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withRouterConfig({ paramsInheritanceStrategy: 'always' })),
    provideHttpClient(withInterceptorsFromDi()),
    provideDefaultClient({
      basePath: environment.apiUrl,
      interceptors: [RefreshInterceptor, AuthClientInterceptor],
    }),
    provideStore(rootReducer),
    provideEffects(AuthenticationEffects, LayoutEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
