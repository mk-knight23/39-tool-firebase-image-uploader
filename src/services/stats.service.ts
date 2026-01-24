import { Injectable, signal, computed, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { STORAGE_KEYS } from '../utils/constants';

export interface StatsState {
  visits: number;
  lastVisit: string;
  totalClicks: number;
  totalImagesViewed: number;
  uploadsCompleted: number;
  themeSwitches: number;
  settingsOpened: number;
  keyboardShortcutsUsed: number;
}

const INITIAL_STATS: StatsState = {
  visits: 0,
  lastVisit: '',
  totalClicks: 0,
  totalImagesViewed: 0,
  uploadsCompleted: 0,
  themeSwitches: 0,
  settingsOpened: 0,
  keyboardShortcutsUsed: 0
};

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private platformId = inject(PLATFORM_ID);

  private _stats = signal<StatsState>(INITIAL_STATS);
  readonly stats = this._stats.asReadonly();

  readonly statsSummary = computed(() => {
    const s = this._stats();
    return {
      totalVisits: s.visits,
      totalClicks: s.totalClicks,
      uploads: s.uploadsCompleted,
      themeSwitches: s.themeSwitches,
      shortcutsUsed: s.keyboardShortcutsUsed
    };
  });

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadStats();
    }

    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(this._stats()));
      }
    });
  }

  private loadStats(): void {
    const stored = localStorage.getItem(STORAGE_KEYS.STATS);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        this._stats.set({ ...INITIAL_STATS, ...parsed });
      } catch {
        this._stats.set(INITIAL_STATS);
      }
    }
  }

  recordVisit(): void {
    const now = new Date().toISOString();
    this._stats.update(s => ({
      ...s,
      visits: s.visits + 1,
      lastVisit: now
    }));
  }

  recordClick(): void {
    this._stats.update(s => ({
      ...s,
      totalClicks: s.totalClicks + 1
    }));
  }

  recordImageView(): void {
    this._stats.update(s => ({
      ...s,
      totalImagesViewed: s.totalImagesViewed + 1
    }));
  }

  recordUpload(): void {
    this._stats.update(s => ({
      ...s,
      uploadsCompleted: s.uploadsCompleted + 1
    }));
  }

  recordThemeSwitch(): void {
    this._stats.update(s => ({
      ...s,
      themeSwitches: s.themeSwitches + 1
    }));
  }

  recordSettingsOpen(): void {
    this._stats.update(s => ({
      ...s,
      settingsOpened: s.settingsOpened + 1
    }));
  }

  recordKeyboardShortcut(): void {
    this._stats.update(s => ({
      ...s,
      keyboardShortcutsUsed: s.keyboardShortcutsUsed + 1
    }));
  }

  exportStats(): string {
    return JSON.stringify(this._stats(), null, 2);
  }

  resetStats(): void {
    this._stats.set(INITIAL_STATS);
  }
}
