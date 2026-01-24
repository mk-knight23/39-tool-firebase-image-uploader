import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, X, Moon, Sun, Volume2, VolumeX, Keyboard, RotateCcw, Download, Info } from 'lucide-angular';
import { SettingsService } from '../../services/settings.service';
import { StatsService } from '../../services/stats.service';
import { AudioService } from '../../services/audio.service';
import { KeyboardService } from '../../services/keyboard.service';
import { KEYBOARD_SHORTCUTS } from '../../utils/constants';

@Component({
  selector: 'app-settings-panel',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    @if (settingsService.settings().showHelp) {
      <div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" (click)="close()"></div>
        <div class="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
          <div class="flex items-center justify-between px-8 py-6 border-b border-slate-200 dark:border-slate-800">
            <h2 class="text-xl font-display font-black uppercase tracking-tight dark:text-white flex items-center gap-3">
              <lucide-icon [name]="'settings'" [size]="24"></lucide-icon>
              Settings
            </h2>
            <button (click)="close()" class="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
              <lucide-icon [name]="'x'" [size]="20" class="dark:text-white"></lucide-icon>
            </button>
          </div>

          <div class="p-8 space-y-8 max-h-[60vh] overflow-y-auto">
            <div class="space-y-6">
              <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Appearance</h3>
              <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                <div class="flex items-center gap-4">
                  <div class="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                    <lucide-icon [name]="settingsService.isDarkMode() ? 'sun' : 'moon'" [size]="20" class="text-indigo-600 dark:text-indigo-400"></lucide-icon>
                  </div>
                  <div>
                    <p class="font-bold dark:text-white">Theme</p>
                    <p class="text-sm text-slate-500">{{ settingsService.themeLabel() }} Mode</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <button (click)="cycleTheme()" class="px-4 py-2 bg-white dark:bg-slate-700 rounded-xl text-sm font-bold dark:text-white shadow-sm hover:shadow-md transition-all active:scale-95">
                    Cycle
                  </button>
                </div>
              </div>
            </div>

            <div class="space-y-6">
              <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Sound</h3>
              <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                <div class="flex items-center gap-4">
                  <div class="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                    <lucide-icon [name]="settingsService.settings().soundEnabled ? 'volume-2' : 'volume-x'" [size]="20" class="text-indigo-600 dark:text-indigo-400"></lucide-icon>
                  </div>
                  <div>
                    <p class="font-bold dark:text-white">Sound Effects</p>
                    <p class="text-sm text-slate-500">{{ settingsService.settings().soundEnabled ? 'Enabled' : 'Disabled' }}</p>
                  </div>
                </div>
                <button (click)="toggleSound()" class="w-14 h-8 rounded-full transition-colors duration-300 {{ settingsService.settings().soundEnabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600' }}">
                  <div class="w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 {{ settingsService.settings().soundEnabled ? 'translate-x-7' : 'translate-x-1' }}"></div>
                </button>
              </div>
            </div>

            <div class="space-y-6">
              <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Keyboard Shortcuts</h3>
              <div class="space-y-3">
                @for (shortcut of shortcutsList; track shortcut.action) {
                  <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                    <div class="flex items-center gap-4">
                      <div class="p-2 bg-slate-200 dark:bg-slate-700 rounded-lg">
                        <lucide-icon [name]="'keyboard'" [size]="16" class="text-slate-600 dark:text-slate-400"></lucide-icon>
                      </div>
                      <div>
                        <p class="font-bold dark:text-white capitalize">{{ shortcut.action.replace(/([A-Z])/g, ' $1') }}</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      @for (key of shortcut.keys; track key) {
                        <kbd class="px-3 py-1.5 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white">{{ key }}</kbd>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>

            <div class="space-y-6">
              <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Statistics</h3>
              <div class="grid grid-cols-2 gap-4">
                <div class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-center">
                  <p class="text-2xl font-black dark:text-white">{{ statsService.stats().visits }}</p>
                  <p class="text-xs text-slate-500 uppercase tracking-wider">Visits</p>
                </div>
                <div class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-center">
                  <p class="text-2xl font-black dark:text-white">{{ statsService.stats().totalClicks }}</p>
                  <p class="text-xs text-slate-500 uppercase tracking-wider">Clicks</p>
                </div>
                <div class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-center">
                  <p class="text-2xl font-black dark:text-white">{{ statsService.stats().uploadsCompleted }}</p>
                  <p class="text-xs text-slate-500 uppercase tracking-wider">Uploads</p>
                </div>
                <div class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-center">
                  <p class="text-2xl font-black dark:text-white">{{ statsService.stats().themeSwitches }}</p>
                  <p class="text-xs text-slate-500 uppercase tracking-wider">Theme Switches</p>
                </div>
              </div>
            </div>
          </div>

          <div class="px-8 py-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 flex items-center justify-between gap-4">
            <button (click)="resetSettings()" class="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-red-500 transition-colors text-sm font-bold">
              <lucide-icon [name]="'rotate-ccw'" [size]="16"></lucide-icon>
              Reset All
            </button>
            <div class="flex items-center gap-2">
              <button (click)="exportSettings()" class="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-xl text-sm font-bold dark:text-white hover:shadow-md transition-all">
                <lucide-icon [name]="'download'" [size]="16"></lucide-icon>
                Export
              </button>
              <button (click)="close()" class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-95">
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    :host { display: block; }
    kbd {
      @apply px-2 py-1 text-xs font-mono bg-slate-100 dark:bg-slate-700 rounded;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes zoomIn {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    .animate-in {
      animation-fill-mode: both;
    }
    .fade-in { animation-name: fadeIn; }
    .zoom-in { animation-name: zoomIn; }
  `]
})
export class SettingsPanelComponent {
  settingsService = inject(SettingsService);
  statsService = inject(StatsService);
  private audioService = inject(AudioService);
  private keyboardService = inject(KeyboardService);

  readonly shortcutsList = [
    { action: 'toggleTheme', keys: KEYBOARD_SHORTCUTS.TOGGLE_THEME },
    { action: 'toggleHelp', keys: KEYBOARD_SHORTCUTS.TOGGLE_HELP },
    { action: 'toggleSettings', keys: KEYBOARD_SHORTCUTS.TOGGLE_SETTINGS },
    { action: 'close', keys: KEYBOARD_SHORTCUTS.CLOSE }
  ];

  @HostListener('document:keydown.escape')
  close(): void {
    this.settingsService.hideHelp();
  }

  cycleTheme(): void {
    this.audioService.playClick();
    this.settingsService.toggleTheme();
  }

  toggleSound(): void {
    this.audioService.playClick();
    this.settingsService.toggleSound();
  }

  exportSettings(): void {
    this.audioService.playClick();
    const settings = this.settingsService.exportSettings();
    const stats = this.statsService.exportStats();
    const data = JSON.stringify({ settings: JSON.parse(settings), stats: JSON.parse(stats) }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'firebase-uploader-data.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  resetSettings(): void {
    this.audioService.playClick();
    this.settingsService.resetSettings();
    this.statsService.resetStats();
  }
}
