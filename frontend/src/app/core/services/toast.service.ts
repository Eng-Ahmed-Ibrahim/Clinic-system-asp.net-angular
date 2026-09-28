import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  readonly toasts = signal<ToastItem[]>([]);

  show(type: ToastType, message: string, title?: string, duration: number = 4000): void {
    const id = Math.random().toString(36).substring(2, 9);
    const item: ToastItem = { id, type, title, message };
    this.toasts.update((current) => [...current, item]);

    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }
  }

  success(message: string, title?: string, duration: number = 4000): void {
    this.show('success', message, title ?? 'Success', duration);
  }

  error(message: string, title?: string, duration: number = 4500): void {
    this.show('error', message, title ?? 'Error', duration);
  }

  info(message: string, title?: string, duration: number = 4000): void {
    this.show('info', message, title ?? 'Information', duration);
  }

  warning(message: string, title?: string, duration: number = 4000): void {
    this.show('warning', message, title ?? 'Warning', duration);
  }

  remove(id: string): void {
    this.toasts.update((current) => current.filter((t) => t.id !== id));
  }
}
