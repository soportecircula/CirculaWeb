import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/landing/landing').then((m) => m.Landing),
    children:[
      {
        path: '',
        loadComponent:() => import('./features/landing/home/home').then((m) => m.Home)
      },
      {
        path: 'products',
        loadComponent:() => import('./features/landing/products/products').then((m) => m.Products)
      },
      {
        path: 'resources',
        loadComponent:() => import('./features/landing/resources/resources').then((m) => m.Resources)
      },
      {
        path: 'about',
        loadComponent:() => import('./features/landing/about/about').then((m) => m.About)
      }
    ]
  },
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./features/auth/login/login').then((m) => m.LoginComponent),
  },
  // {
  //   path: 'auth/register',
  //   loadComponent: () =>
  //     import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
  // },
  {
    path: 'auth/forgot-password',
    loadComponent: () =>
      import('./features/auth/forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent,
      ),
  },
  {
    path: 'auth/reset-password',
    loadComponent: () =>
      import('./features/auth/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent,
      ),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./features/auth/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent,
      ),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./layouts/layout.component').then((m) => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/auth/profile/profile.component').then((m) => m.ProfileComponent),
      },
      {
        path: 'change-password',
        loadComponent: () =>
          import('./features/auth/change-password/change-password.component').then(
            (m) => m.ChangePasswordComponent,
          ),
      },
    ],
  },
  { path: '**', redirectTo: 'auth/login' },
];
