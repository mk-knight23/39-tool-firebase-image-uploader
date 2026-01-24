import { Injectable, signal, inject, PLATFORM_ID, HostListener } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SettingsService } from './settings.service';
import { StatsService } from './stats.service';
import { KEYBOARD_SHORTCUTS } from '../utils/constants';

export type KeyboardAction = 'toggleTheme' | 'toggleHelp' | 'toggleSettings' | 'close' | 'none';

@Injectable({
  providedIn: 'root'
})
export class KeyboardService {
  private platformId = inject(PLATFORM_ID);
  private settingsService = inject(SettingsService);
  private statsService = inject(StatsService);

  readonly lastAction = signal<KeyboardAction>('none');

  private modifiers = {
    ctrl: false,
    meta: false,
    shift: false,
    alt: false
  };

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.setupGlobalListeners();
    }
  }

  private setupGlobalListeners(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', (e) => this.handleKeyDown(e));
      window.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }
  }

  private handleKeyDown(event: KeyboardEvent): void {
    this.modifiers.ctrl = event.ctrlKey;
    this.modifiers.meta = event.metaKey;
    this.modifiers.shift = event.shiftKey;
    this.modifiers.alt = event.altKey;

    const action = this.parseShortcut(event);
    if (action !== 'none') {
      event.preventDefault();
      this.executeAction(action);
    }
  }

  private handleKeyUp(event: KeyboardEvent): void {
    this.modifiers.ctrl = event.ctrlKey;
    this.modifiers.meta = event.metaKey;
    this.modifiers.shift = event.shiftKey;
    this.modifiers.alt = event.altKey;
  }

  private parseShortcut(event: KeyboardEvent): KeyboardAction {
    const key = event.key.toLowerCase();

    if (KEYBOARD_SHORTCUTS.TOGGLE_THEME.some(shortcut => this.matchesShortcut(shortcut, event))) {
      return 'toggleTheme';
    }

    if (KEYBOARD_SHORTCUTS.TOGGLE_HELP.some(shortcut => this.matchesShortcut(shortcut, event))) {
      return 'toggleHelp';
    }

    if (KEYBOARD_SHORTCUTS.TOGGLE_SETTINGS.some(shortcut => this.matchesShortcut(shortcut, event))) {
      return 'toggleSettings';
    }

    if (KEYBOARD_SHORTCUTS.CLOSE.includes(key)) {
      return 'close';
    }

    return 'none';
  }

  private matchesShortcut(shortcut: string, event: KeyboardEvent): boolean {
    const parts = shortcut.split('+');
    const expectedMods = parts.slice(0, -1);
    const expectedKey = parts[parts.length - 1].toLowerCase();

    const hasCtrl = expectedMods.includes('ctrl') ? event.ctrlKey : !event.ctrlKey;
    const hasMeta = expectedMods.includes('meta') ? event.metaKey : !event.metaKey;

    return hasCtrl && hasMeta && event.key.toLowerCase() === expectedKey;
  }

  private executeAction(action: KeyboardAction): void {
    this.lastAction.set(action);
    this.statsService.recordKeyboardShortcut();

    switch (action) {
      case 'toggleTheme':
        this.settingsService.toggleTheme();
        this.statsService.recordThemeSwitch();
        break;
      case 'toggleHelp':
        this.settingsService.toggleHelp();
        this.statsService.recordSettingsOpen();
        break;
      case 'toggleSettings':
        this.settingsService.toggleHelp();
        this.statsService.recordSettingsOpen();
        break;
      case 'close':
        break;
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    this.handleKeyDown(event);
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    this.handleKeyUp(event);
  }
}
