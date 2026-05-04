import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { BtnDemo } from '../../../shared/components/btn-demo/btn-demo';
import { BtnLogin } from '../../../shared/components/btn-login/btn-login';
import { ImpactMetricRead } from '../../../../client';
import { BrandsSlider } from '../../../layouts/brands-slider/brands-slider';
import * as ImpactMetricsActions from '../../../store/ImpactMetrics/impact-metrics.actions';
import { selectMetrics, selectMetricsError, selectMetricsLoading } from '../../../store/ImpactMetrics/impact-metrics.selectors';

@Component({
  selector: 'app-home',
  imports: [CommonModule, BtnDemo, BtnLogin, BrandsSlider],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
})
export class Home implements OnInit, OnDestroy {
  @ViewChild('heroVideo') heroVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('impactSection') impactSection!: ElementRef<HTMLElement>;

  private readonly store = inject(Store);

  readonly metrics = this.store.selectSignal(selectMetrics);
  readonly loading = this.store.selectSignal(selectMetricsLoading);
  readonly error = this.store.selectSignal(selectMetricsError);

  displayValues = signal<Record<number, number | undefined>>({});

  private observer: IntersectionObserver | null = null;
  private hasAnimated = false;
  private isSectionVisible = false;

  constructor() {
    // Cuando las métricas llegan del store, inicializar displayValues y animar si la sección ya es visible
    effect(() => {
      const metrics = this.metrics();
      if (metrics.length === 0) return;
      const initial: Record<number, number> = {};
      metrics.forEach((m) => (initial[m.id] = 0));
      this.displayValues.set(initial);
      if (this.isSectionVisible && !this.hasAnimated) {
        this.animateCounters(metrics);
        this.hasAnimated = true;
        this.observer?.disconnect();
      }
    });
  }

  // Mapear nombres de iconos de Material (DB) a Bootstrap Icons (Frontend)
  getBootstrapIcon(materialIcon: string | undefined): string {
    if (!materialIcon) return 'graph-up-arrow';
    const mapper: Record<string, string> = {
      'location_on': 'geo-alt',
      'recycling': 'recycle',
      'business': 'building'
    };
    return mapper[materialIcon] || materialIcon;
  }

  ngOnInit(): void {
    this.store.dispatch(ImpactMetricsActions.loadMetrics());
  }

  ngAfterViewInit(): void {
    if (this.heroVideo) {
      const video = this.heroVideo.nativeElement;
      video.muted = true;
      video.play().catch((err) => {
        console.error('Error al reproducir el video hero:', err);
      });
    }

    if (this.impactSection) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.isSectionVisible = true;
            // Solo animar si los datos de las métricas ya se cargaron completamente
            if (this.metrics().length > 0 && !this.hasAnimated) {
              this.animateCounters(this.metrics());
              this.hasAnimated = true;
              this.observer?.disconnect();
            }
          }
        });
      }, { threshold: 0.2 });

      this.observer.observe(this.impactSection.nativeElement);
    }
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private animateCounters(metrics: ImpactMetricRead[]): void {
    const initialValues: Record<number, number> = {};
    metrics.forEach(m => initialValues[m.id] = 0);
    this.displayValues.set(initialValues);

    const duration = 2000;
    const totalFrames = Math.round(duration / (1000 / 60));
    let frame = 0;
    const targets = metrics.map(m => ({ id: m.id, value: m.value }));

    const loop = () => {
      frame++;
      const eased = this.easeOutQuad(Math.min(frame / totalFrames, 1));
      this.displayValues.set(
        Object.fromEntries(targets.map(m => [m.id, m.value * eased]))
      );
      if (frame < totalFrames) requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  private easeOutQuad(t: number): number {
    return t * (2 - t);
  }
}
