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

---

## Sistema de estilos

### Arquitectura SCSS

La compilación de estilos sigue este orden en `app.scss`:

```
_variables.scss       → tokens Circula + Bootstrap
_variables-custom.scss → medidas de layout
bootstrap/...         → sistema Bootstrap
theme/_default.scss   → CSS vars Velzon (--vz-*)
components/, pages/   → componentes y páginas globales
custom.scss           → :root con --circula-* (siempre al final)
```

---

### Tokens de diseño Circula

Definidos en `_variables.scss` y publicados en `:root` desde `custom.scss`.

| Token SCSS | CSS custom property | Valor | Uso |
|---|---|---|---|
| `$circula-primary` | `--circula-primary` | `#2ab1f0` | Acento principal |
| `$circula-brand-text` | `--circula-brand-text` | `#82C4FA` | Textos de marca, botones |
| `$circula-text-dark` | `--circula-text-dark` | `#1e293b` | Textos principales |
| `$circula-text-muted` | `--circula-text-muted` | `#475569` | Textos secundarios |
| `$circula-bg-subtle` | `--circula-bg-subtle` | `#f0f6fa` | Fondo landing |
| `$circula-highlight-bg` | `--circula-highlight-bg` | `#f8fafc` | Fondo tarjetas |
| `$circula-bg-sky` | `--circula-bg-sky` | `#f0f9ff` | Badges y pills |
| `$circula-border-subtle` | `--circula-border-subtle` | `#e2e8f0` | Bordes suaves |

Variantes precomputadas (generadas en `custom.scss`, no editar directamente):

| CSS custom property | Descripcion |
|---|---|
| `--circula-primary-rgb` | RGB para `rgba()` |
| `--circula-primary-dark` | darken 5% |
| `--circula-primary-darker` | darken 10% |
| `--circula-brand-text-rgb` | RGB para `rgba()` |
| `--circula-brand-text-dark` | darken 5% |
| `--circula-brand-text-darker` | darken 14% |
| `--circula-brand-text-light` | lighten 5% |
| `--circula-border-subtle-rgb` | RGB para `rgba()` |
| `--circula-bg-sky-rgb` | RGB para `rgba()` |

---

### Usar colores en un componente Angular

Las CSS custom properties estan en `:root` — **no se necesita ningun `@import`**:

```scss
/* mi-componente.scss */

.mi-titulo {
  color: var(--circula-text-dark);
}

.mi-badge {
  background-color: var(--circula-bg-sky);
  border: 1px solid rgba(var(--circula-primary-rgb), 0.2);
  color: var(--circula-brand-text);
}

.mi-boton {
  background-color: var(--circula-brand-text);
  color: #fff;

  &:hover {
    background-color: var(--circula-brand-text-dark);
    box-shadow: 0 8px 24px rgba(var(--circula-brand-text-rgb), 0.3);
  }
}
```

Regla: nunca hardcodear colores de marca. Siempre usar `var(--circula-*)`.

---

### Agregar un nuevo token de color

1. Declarar en `_variables.scss`:

```scss
$circula-success-custom: #0ab39c;
```

2. Publicar en `custom.scss`:

```scss
:root {
  --circula-success-custom:     #{$circula-success-custom};
  --circula-success-custom-rgb: #{red($circula-success-custom)}, #{green($circula-success-custom)}, #{blue($circula-success-custom)};
}
```

3. Usar en cualquier componente sin import:

```scss
.estado-activo {
  color: var(--circula-success-custom);
  background: rgba(var(--circula-success-custom-rgb), 0.1);
}
```

---

### Modificar un token existente

Solo cambiar el valor en `_variables.scss`. El cambio se propaga a toda la app:

```scss
$circula-primary: #1a9de0;
```

---

### Estilos globales vs. estilos de componente

| Tipo | Ubicacion | Cuando usarlo |
|---|---|---|
| Reset / base | `src/styles.scss` | `body`, `box-sizing`, tipografia global |
| Tokens SCSS | `_variables.scss` | Colores y medidas de marca |
| CSS custom properties | `custom.scss` | Publicar tokens para componentes |
| Componentes UI Bootstrap | `scss/components/` | Botones, cards, badges extendidos |
| Paginas sin `styleUrls` | `scss/pages/` | Login, dashboard layouts completos |
| Componente con `styleUrls` | `src/app/**/mi.scss` | Estilos encapsulados del componente |

Si el `@Component` no tiene `styleUrls` → clases CSS en `scss/pages/`.
Si el `@Component` tiene `styleUrls` → estilos en el `.scss` del componente (encapsulados por Angular).

---

### Agregar estilos para una pagina global nueva

Crear el archivo en `src/assets/scss/pages/` e importarlo en `app.scss`:

```scss
@import "pages/mi-nueva-seccion";
```

---

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
