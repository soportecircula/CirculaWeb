import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, signal } from '@angular/core';

@Component({
  selector: 'app-brands-slider',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './brands-slider.html',
})
export class BrandsSlider implements AfterViewInit, OnDestroy {
  brandsReady = signal<boolean>(false);

  ngAfterViewInit(): void {
    // Esperar dos frames de animación antes de iniciar el slider.
    // El doble rAF garantiza que el primer frame ya fue pintado y el
    // compositor GPU tiene sus capas listas, evitando el arranque lento.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.brandsReady.set(true);
      });
    });
  }

  ngOnDestroy(): void {
    this.brandsReady.set(false);
  }
}
