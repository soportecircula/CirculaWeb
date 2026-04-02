import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="auth-page-wrapper">
      <div class="auth-one-bg-position auth-one-bg" id="auth-particles">
        <div class="bg-overlay"></div>
        <div class="shape">
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1440 120">
            <path d="M 0,36 C 144,53.6 432,123.2 720,124 C 1008,124.8 1296,56.8 1440,40L1440 140L0 140z"></path>
          </svg>
        </div>
      </div>
      <div class="auth-page-content">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-lg-8 text-center">
              <div class="mt-sm-5 mb-5 text-white">
                <h1 class="display-4 fw-bold mb-3">Circula</h1>
                <p class="fs-18 fw-medium text-white-50 mb-2">Plataforma REP</p>
                <p class="fs-15 text-white-50 mb-5">
                  Responsabilidad Extendida del Productor — Gestiona el ciclo de vida
                  de productos y cumplimiento normativo en un solo lugar.
                </p>
                <div class="d-flex gap-3 justify-content-center flex-wrap">
                  <a routerLink="/auth/login" class="btn btn-success btn-lg px-5">
                    <i class="mdi mdi-login me-2"></i>Iniciar Sesión
                  </a>
                  <a routerLink="/auth/register" class="btn btn-outline-light btn-lg px-5">
                    <i class="mdi mdi-account-plus me-2"></i>Registrarse
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div class="row justify-content-center mt-4 g-4">
            <div class="col-md-4">
              <div class="card card-bg-fill text-center h-100">
                <div class="card-body p-4">
                  <i class="mdi mdi-recycle display-4 text-success mb-3 d-block"></i>
                  <h5 class="card-title">Gestión REP</h5>
                  <p class="card-text text-muted">
                    Administra tus obligaciones de Responsabilidad Extendida del Productor de forma eficiente.
                  </p>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card card-bg-fill text-center h-100">
                <div class="card-body p-4">
                  <i class="mdi mdi-chart-line display-4 text-primary mb-3 d-block"></i>
                  <h5 class="card-title">Reportes y Trazabilidad</h5>
                  <p class="card-text text-muted">
                    Genera reportes de cumplimiento y rastrea el ciclo de vida de tus productos.
                  </p>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card card-bg-fill text-center h-100">
                <div class="card-body p-4">
                  <i class="mdi mdi-shield-check display-4 text-info mb-3 d-block"></i>
                  <h5 class="card-title">Cumplimiento Normativo</h5>
                  <p class="card-text text-muted">
                    Mantente al día con la normativa ambiental colombiana vigente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer class="footer">
        <div class="container">
          <div class="row">
            <div class="col-lg-12">
              <div class="text-center">
                <p class="mb-0 text-muted">&copy; {{ currentYear }} Circula Colombia S.A.S.</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `,
})
export class LandingComponent {
  currentYear = new Date().getFullYear();
}
