import { Injectable } from '@angular/core';
import { analytics, logEvent } from '../core/config/firebase.config';

interface AnalyticsEvent {
  event: string;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private isAnalyticsInitialized = false;

  constructor() {
    // Initialize analytics when service is created
    if (analytics) {
      this.isAnalyticsInitialized = true;
    }
  }

  /**
   * Log an event to Firebase Analytics
   */
  logEvent(event: string, params?: { [key: string]: any }): void {
    if (!this.isAnalyticsInitialized) {
      console.warn('Analytics not initialized. Skipping event:', event);
      return;
    }

    try {
      logEvent(analytics, event, params);
    } catch (error) {
      console.error('Failed to log analytics event:', error);
    }
  }

  /**
   * Track user actions
   */
  trackUserAction(action: string, details?: any): void {
    this.logEvent('user_action', {
      action,
      ...details,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track upload events
   */
  trackUploadEvent(fileSize: number, success: boolean, duration?: number): void {
    this.logEvent('file_upload', {
      file_size: fileSize,
      success,
      duration,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track delete events
   */
  trackDeleteEvent(fileSize: number, imageId: string): void {
    this.logEvent('file_delete', {
      file_size: fileSize,
      image_id: imageId,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track download events
   */
  trackDownloadEvent(fileSize: number, imageId: string): void {
    this.logEvent('file_download', {
      file_size: fileSize,
      image_id: imageId,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track view events
   */
  trackImageView(imageId: string, duration?: number): void {
    this.logEvent('image_view', {
      image_id: imageId,
      duration,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track batch upload events
   */
  trackBatchUpload(fileCount: number, totalSize: number, success: boolean): void {
    this.logEvent('batch_upload', {
      file_count: fileCount,
      total_size: totalSize,
      success,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track settings changes
   */
  trackSettingsChange(setting: string, value: any): void {
    this.logEvent('settings_change', {
      setting,
      value,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Get user session data
   */
  getSessionData(): {
    session_start: Date;
    page_views: number;
    uploads: number;
    downloads: number;
  } {
    return {
      session_start: new Date(),
      page_views: parseInt(localStorage.getItem('page_views') || '0', 10),
      uploads: parseInt(localStorage.getItem('uploads') || '0', 10),
      downloads: parseInt(localStorage.getItem('downloads') || '0', 10)
    };
  }

  /**
   * Increment page view counter
   */
  incrementPageView(): void {
    const current = parseInt(localStorage.getItem('page_views') || '0', 10);
    localStorage.setItem('page_views', (current + 1).toString());

    if (current === 0) {
      this.logEvent('session_start', {
        timestamp: new Date().toISOString()
      });
    }
  }
}