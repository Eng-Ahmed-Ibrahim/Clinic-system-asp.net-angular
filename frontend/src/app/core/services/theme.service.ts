import { Injectable, signal, computed, effect } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly storageKey = 'medicore_theme';
  readonly theme = signal<ThemeMode>(this.getInitialTheme());
  readonly isDark = computed(() => this.theme() === 'dark');

  constructor() {
    // Apply theme on initialization and whenever it changes
    effect(() => {
      const current = this.theme();
      if (typeof document !== 'undefined') {
        const root = document.documentElement;
        if (current === 'dark') {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
        try {
          localStorage.setItem(this.storageKey, current);
        } catch {
          // Ignore localStorage errors
        }
      }
    });
  }

  private getInitialTheme(): ThemeMode {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(this.storageKey) as ThemeMode | null;
      if (saved === 'dark' || saved === 'light') {
        return saved;
      }
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  }

  toggleTheme(): void {
    this.theme.update((curr) => (curr === 'dark' ? 'light' : 'dark'));
  }

  setTheme(mode: ThemeMode): void {
    this.theme.set(mode);
  }
}
