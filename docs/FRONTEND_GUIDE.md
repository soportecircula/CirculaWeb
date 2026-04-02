# Frontend Guide — Angular + Velzon + ng-openapi (CirculaWeb)

## Stack

- Angular 21 standalone + Signals + OnPush
- NgRx clásico (store/Authentication + store/Layout)
- Bootstrap 5.3 + Velzon UI template
- ng-openapi para cliente HTTP generado
- Bun como gestor de paquetes
- Biome como linter/formatter

## Reglas

- Componentes **standalone** siempre (sin `NgModule`)
- **ChangeDetectionStrategy.OnPush** en todos los componentes
- **Signals** para estado local (`signal`, `computed`, `effect`)
- NO editar `frontend/src/client/` manualmente (generado por ng-openapi)
- NO modificar `velzon/` (vendor licenciado)
- Copia incremental desde `velzon/` hacia `frontend/` según necesidad

## Estructura

```
frontend/src/
├── app/
│   ├── app.ts              # App root component
│   ├── app.config.ts       # providers (router, store, http, effects)
│   ├── app.routes.ts       # rutas lazy
│   ├── core/
│   │   ├── auth/           # guards, interceptors, auth.service
│   │   ├── notifications/  # NotificationService, messages.ts
│   │   └── utils/          # image-url.ts
│   ├── features/
│   │   ├── landing/        # LandingComponent (sin auth)
│   │   ├── dashboard/      # DashboardComponent
│   │   └── auth/           # login, register, forgot-password, reset-password, profile, change-password
│   ├── layouts/
│   │   ├── layout.component.ts
│   │   ├── sidebar/
│   │   ├── footer/
│   │   └── mobile-header/
│   ├── shared/components/
│   │   └── toast-container/
│   └── store/
│       ├── Authentication/  # actions, effects, reducer, selectors
│       └── Layout/          # actions, effects, reducer, selectors
└── client/                  # generado por ng-openapi (NO editar)
```

## Generación del cliente HTTP

```bash
# Requiere backend corriendo en localhost:8000
bash scripts/generate-client.sh
```

Esto:
1. Descarga `swagger.json` del backend
2. Genera `frontend/src/client/` con ng-openapi
3. Formatea con Biome

## Rutas de la app

| Ruta | Componente | Auth requerida |
|---|---|---|
| `/` | LandingComponent | No |
| `/auth/login` | LoginComponent | No |
| `/auth/register` | RegisterComponent | No |
| `/auth/forgot-password` | ForgotPasswordComponent | No |
| `/auth/reset-password` | ResetPasswordComponent | No |
| `/dashboard` | DashboardComponent (layout) | Sí |
| `/dashboard/profile` | ProfileComponent | Sí |
| `/dashboard/change-password` | ChangePasswordComponent | Sí |

## Notificaciones

```typescript
import { NotificationService } from '../../core/notifications/notification.service';
import { getApiErrorDetail } from '../../core/notifications/messages';

private notif = inject(NotificationService);

// Uso:
this.notif.success('Operación exitosa.');
this.notif.error(getApiErrorDetail(err));
```

## Auth Service

```typescript
import { AuthService } from '../../core/auth/auth.service';

readonly auth = inject(AuthService);

// Señales disponibles:
auth.user()           // UserMeResponse | null
auth.isAuthenticated() // boolean
auth.isSuperAdmin()    // boolean
auth.isLoading()       // boolean
```

## Store NgRx

### Auth actions disponibles

```typescript
import * as AuthActions from '../../store/Authentication/authentication.actions';

store.dispatch(AuthActions.login({ email, password }));
store.dispatch(AuthActions.logout());
store.dispatch(AuthActions.updateUserFromProfile({ user }));
```

### Auth selectors

```typescript
import * as AuthSelectors from '../../store/Authentication/authentication.selectors';

store.select(AuthSelectors.selectUser)
store.select(AuthSelectors.selectIsAuthenticated)
store.select(AuthSelectors.selectIsSuperAdmin)
```

## Convención de botones

| Acción | Clase CSS |
|---|---|
| Agregar / Crear / Nuevo | `btn-success` |
| Editar | `btn-soft-secondary` |
| Eliminar | `btn-soft-danger` |
| Navegación / Acción contextual | `btn-primary` / `btn-soft-primary` |
| Cancelar / Volver | `btn-soft-danger` / `btn-light` |

## Email (input con @)

```html
<div class="input-group">
  <span class="input-group-text">&#64;</span>
  <input type="email" class="form-control" formControlName="email" maxlength="255">
</div>
```

## Password con toggle visibility

```html
<div class="position-relative auth-pass-inputgroup">
  <input [type]="showPassword() ? 'text' : 'password'"
    class="form-control pe-5 password-input"
    formControlName="password" maxlength="255">
  <button class="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon material-shadow-none"
    type="button" (click)="togglePassword()">
    <i class="mdi align-middle"
      [class.mdi-eye-outline]="showPassword()"
      [class.mdi-eye-off-outline]="!showPassword()"></i>
  </button>
</div>
```
