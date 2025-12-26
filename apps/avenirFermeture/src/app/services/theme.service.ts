import { DOCUMENT } from '@angular/common';
import {
  DestroyRef,
  Injectable,
  Signal,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';

export type ThemePreference = 'light' | 'dark' | 'system';

const THEME_STORAGE_KEY = 'theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  private readonly systemPrefersDark = signal(false);
  private readonly preferenceSignal = signal<ThemePreference>(
    this.readStoredPreference()
  );

  readonly preference = this.preferenceSignal.asReadonly();
  readonly isDark: Signal<boolean> = computed(
    () => this.resolveTheme(this.preferenceSignal()) === 'dark'
  );

  constructor() {
    const win = this.document.defaultView;
    if (win?.matchMedia) {
      const mediaQueryList = win.matchMedia('(prefers-color-scheme: dark)');
      this.systemPrefersDark.set(mediaQueryList.matches);

      const listener = (event: MediaQueryListEvent) => {
        this.systemPrefersDark.set(event.matches);
      };

      mediaQueryList.addEventListener('change', listener);
      this.destroyRef.onDestroy(() =>
        mediaQueryList.removeEventListener('change', listener)
      );
    }

    effect(() => {
      const preference = this.preferenceSignal();
      this.applyPreferenceToDom(preference);
      this.persistPreference(preference);
    });
  }

  toggle(): void {
    this.preferenceSignal.update((current) => {
      const resolved = this.resolveTheme(current);
      return resolved === 'dark' ? 'light' : 'dark';
    });
  }

  setPreference(preference: ThemePreference): void {
    this.preferenceSignal.set(preference);
  }

  private resolveTheme(preference: ThemePreference): 'light' | 'dark' {
    if (preference === 'system') {
      return this.systemPrefersDark() ? 'dark' : 'light';
    }
    return preference;
  }

  private applyPreferenceToDom(preference: ThemePreference): void {
    const root = this.document.documentElement;
    if (preference === 'system') {
      root.classList.remove('dark-theme', 'light-theme');
      return;
    }

    root.classList.toggle('dark-theme', preference === 'dark');
    root.classList.toggle('light-theme', preference === 'light');
  }

  private persistPreference(preference: ThemePreference): void {
    const win = this.document.defaultView;
    if (!win) return;

    try {
      if (preference === 'system') {
        win.localStorage.removeItem(THEME_STORAGE_KEY);
        return;
      }
      win.localStorage.setItem(THEME_STORAGE_KEY, preference);
    } catch {
      // Ignore storage write errors (e.g. in private mode).
    }
  }

  private readStoredPreference(): ThemePreference {
    const win = this.document.defaultView;
    if (!win) return 'system';

    try {
      const stored = win.localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        return stored;
      }
    } catch {
      // Ignore storage read errors (e.g. in private mode).
    }
    return 'system';
  }
}
