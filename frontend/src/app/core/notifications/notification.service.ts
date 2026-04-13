import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  delay: number;
}

const DELAYS: Record<ToastType, number> = {
  success: 3500,
  error: 5000,
  info: 3500,
  warning: 4000,
};

@Injectable({ providedIn: 'root' })
export class NotificationService {
  readonly toasts = signal<ToastItem[]>([]);

  success(message: string, delay?: number): void {
    this.add(message, 'success', delay ?? DELAYS.success);
  }

  error(message: string, delay?: number): void {
    this.add(message, 'error', delay ?? DELAYS.error);
  }

  info(message: string, delay?: number): void {
    this.add(message, 'info', delay ?? DELAYS.info);
  }

  warning(message: string, delay?: number): void {
    this.add(message, 'warning', delay ?? DELAYS.warning);
  }

  remove(id: string): void {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }

  private add(message: string, type: ToastType, delay: number): void {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    this.toasts.update(list => [...list, { id, message, type, delay }]);
  }
}
