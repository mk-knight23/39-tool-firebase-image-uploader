import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SettingsService } from './settings.service';
import { AUDIO_CONFIG } from '../utils/constants';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private platformId = inject(PLATFORM_ID);
  private settingsService = inject(SettingsService);

  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.initAudioContext();
    }
  }

  private initAudioContext(): void {
    try {
      this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = 0.3;
    } catch {
      console.warn('Web Audio API not supported');
    }
  }

  private ensureContext(): void {
    if (!this.audioContext && isPlatformBrowser(this.platformId)) {
      this.initAudioContext();
    }
    if (this.audioContext?.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  playClick(): void {
    if (!this.settingsService.settings().soundEnabled) return;
    this.ensureContext();

    if (!this.audioContext || !this.masterGain) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(AUDIO_CONFIG.CLICK_FREQUENCY, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(AUDIO_CONFIG.CLICK_FREQUENCY * 0.5, this.audioContext.currentTime + AUDIO_CONFIG.CLICK_DURATION);

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + AUDIO_CONFIG.CLICK_DURATION);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + AUDIO_CONFIG.CLICK_DURATION);
  }

  playHover(): void {
    if (!this.settingsService.settings().soundEnabled) return;
    this.ensureContext();

    if (!this.audioContext || !this.masterGain) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(AUDIO_CONFIG.HOVER_FREQUENCY, this.audioContext.currentTime);

    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + AUDIO_CONFIG.HOVER_DURATION);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + AUDIO_CONFIG.HOVER_DURATION);
  }

  playSuccess(): void {
    if (!this.settingsService.settings().soundEnabled) return;
    this.ensureContext();

    if (!this.audioContext || !this.masterGain) return;

    const now = this.audioContext.currentTime;

    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.masterGain!);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, now + i * 0.1);

      gainNode.gain.setValueAtTime(0.2, now + i * 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.15);

      oscillator.start(now + i * 0.1);
      oscillator.stop(now + i * 0.1 + 0.15);
    });
  }

  playError(): void {
    if (!this.settingsService.settings().soundEnabled) return;
    this.ensureContext();

    if (!this.audioContext || !this.masterGain) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);
    oscillator.frequency.linearRampToValueAtTime(100, this.audioContext.currentTime + 0.2);

    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.2);
  }
}
