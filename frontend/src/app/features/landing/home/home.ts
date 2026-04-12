import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BtnDemo } from '../../../shared/components/btn-demo/btn-demo';
import { BtnLogin } from '../../../shared/components/btn-login/btn-login';
import { ImpactMetricRead, ImpactMetricsService } from '../../../../client';
import { BrandsSlider } from '../../../layouts/brands-slider/brands-slider';

@Component({
  selector: 'app-home',
  imports: [CommonModule, BtnDemo, BtnLogin, BrandsSlider],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit, OnDestroy {
  @ViewChild('heroVideo') heroVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('impactSection') impactSection!: ElementRef<HTMLElement>;

  metrics = signal<ImpactMetricRead[]>([]);
  displayValues = signal<Record<number, number | undefined>>({});
  loading = signal<boolean>(true);
  error = signal<boolean>(false);

  // private readonly impactMetricsService = inject(ImpactService);
  private impactMetricsService = inject(ImpactMetricsService);
  private observer: IntersectionObserver | null = null;
  private hasAnimated = false;
  private isSectionVisible = false;

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
    this.impactMetricsService.impactMetricsGetImpactMetrics().subscribe({
      next: (data) => {
        this.metrics.set(data);
        
        // Inicializar a 0 para que no salgan vacíos antes del scroll
        const initialValues: Record<number, number> = {};
        data.forEach(m => initialValues[m.id] = 0);
        this.displayValues.set(initialValues);

        this.loading.set(false);
        
        // Si el usuario bajó rápido y la sección ya era visible antes de cargar los datos
        if (this.isSectionVisible && !this.hasAnimated) {
          this.animateCounters(data);
          this.hasAnimated = true;
          this.observer?.disconnect();
        }
      },
      error: (err) => {
        console.error('Error fetching metrics', err);
        this.error.set(true);
        this.loading.set(false);
      }
    });
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
    const frameRate = 16;
    const totalFrames = Math.round(duration / frameRate);

    metrics.forEach(metric => {
      let frame = 0;
      const targetValue = metric.value;
      const updateValue = () => {
        frame++;
        const progress = frame / totalFrames;
        const currentVal = targetValue * this.easeOutQuad(progress);
        
        this.displayValues.update(vals => ({
          ...vals,
          [metric.id]: currentVal
        }));

        if (frame < totalFrames) {
          requestAnimationFrame(updateValue);
        } else {
          this.displayValues.update(vals => ({
            ...vals,
            [metric.id]: targetValue
          }));
        }
      };
      requestAnimationFrame(updateValue);
    });
  }

  private easeOutQuad(t: number): number {
    return t * (2 - t);
  }
}
