import { Injectable, signal, computed, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { STORAGE_KEYS, KEYBOARD_SHORTCUTS } from '../utils/constants';

export type ThemeMode = 'light' | 'dark' | 'system';

interface SettingsState {
  theme: ThemeMode;
  soundEnabled: boolean;
  animationsEnabled: boolean;
  reducedMotion: boolean;
  showHelp: boolean;
}

const DEFAULT_SETTINGS: SettingsState = {
  theme: 'system',
  soundEnabled: true,
  animationsEnabled: true,
  reducedMotion: false,
  showHelp: false
};

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private platformId = inject(PLATFORM_ID);

  private _settings = signal<SettingsState>(DEFAULT_SETTINGS);
  readonly settings = this._settings.asReadonly();

  readonly isDarkMode = computed(() => {
    const theme = this._settings().theme;
    if (theme === 'system') {
      if (isPlatformBrowser(this.platformId)) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      return false;
    }
    return theme === 'dark';
  });

  readonly themeLabel = computed(() => {
    const theme = this._settings().theme;
    return theme.charAt(0).toUpperCase() + theme.slice(1);
  });

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadSettings();
    }

    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this._settings()));
      }
    });
  }

  private loadSettings(): void {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        this._settings.set({ ...DEFAULT_SETTINGS, ...parsed });
      } catch {
        this._settings.set(DEFAULT_SETTINGS);
      }
    }

    if (this._settings().reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    }
  }

  setTheme(theme: ThemeMode): void {
    this._settings.update(s => ({ ...s, theme }));
    this.updateColorScheme();
  }

  toggleTheme(): void {
    const nextTheme: Record<ThemeMode, ThemeMode> = {
      light: 'dark',
      dark: 'system',
      system: 'light'
    };
    this.setTheme(nextTheme[this._settings().theme]);
  }

  setSoundEnabled(enabled: boolean): void {
    this._settings.update(s => ({ ...s, soundEnabled: enabled }));
  }

  toggleSound(): void {
    this._settings.update(s => ({ ...s, soundEnabled: !s.soundEnabled }));
  }

  setAnimationsEnabled(enabled: boolean): void {
    this._settings.update(s => ({ ...s, animationsEnabled: enabled }));
    if (!enabled) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }

  toggleAnimations(): void {
    this.setAnimationsEnabled(!this._settings().animationsEnabled);
  }

  toggleHelp(): void {
    this._settings.update(s => ({ ...s, showHelp: !s.showHelp }));
  }

  hideHelp(): void {
    this._settings.update(s => ({ ...s, showHelp: false }));
  }

  private updateColorScheme(): void {
    const isDark = this.isDarkMode();
    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.classList.toggle('dark', isDark);
      document.documentElement.classList.toggle('light', !isDark);
    }
  }

  exportSettings(): string {
    return JSON.stringify(this._settings(), null, 2);
  }

  resetSettings(): void {
    this._settings.set(DEFAULT_SETTINGS);
    this.updateColorScheme();
  }
}
