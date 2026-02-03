import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Upload, FileImage, X } from 'lucide-angular';
import { DragDropService, FileValidationResult } from '../../services/drag-drop.service';
import { FirebaseService } from '../../services/firebase.service';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="upload-container">
      <!-- Upload Zone -->
      <div
        class="drop-zone"
        (dragenter)="onDragEnter($event)"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)"
        [class.drag-over]="isDragging"
        [class.uploading]="isUploading"
      >
        <div class="drop-zone-content">
          <!-- Icon -->
          <div class="drop-zone-icon">
            <lucide-icon [name]="'upload'" [size]="48" class="text-indigo-500"></lucide-icon>
          </div>

          <!-- Title and Description -->
          <div class="drop-zone-text">
            <h3 class="drop-zone-title">Drop your masterpieces here</h3>
            <p class="drop-zone-subtitle">
              Supports PNG, JPG, WebP up to 10MB
            </p>
          </div>

          <!-- Browse Button -->
          <button
            type="button"
            class="browse-button"
            (click)="triggerFileSelect()"
          >
            Browse Files
          </button>

          <!-- Hidden File Input -->
          <input
            type="file"
            #fileInput
            class="hidden"
            accept="image/*"
            multiple
            (change)="onFileSelect($event)"
          />
        </div>

        <!-- Drag Over Overlay -->
        <div *ngIf="isDragging" class="drop-zone-overlay">
          <div class="drop-zone-overlay-content">
            <lucide-icon [name]="'file-image'" [size]="64" class="text-white"></lucide-icon>
            <h3 class="drop-zone-overlay-title">Drop files to upload</h3>
            <p class="drop-zone-overlay-subtitle">
              {{ selectedFiles.length }} file{{ selectedFiles.length !== 1 ? 's' : '' }} selected
            </p>
          </div>
        </div>
      </div>

      <!-- Selected Files List -->
      <div *ngIf="selectedFiles.length > 0" class="selected-files">
        <h4 class="selected-files-title">Selected Files</h4>

        <div class="selected-files-list">
          <div *ngFor="let file of selectedFiles; let i = index" class="selected-file-item">
            <div class="selected-file-info">
              <lucide-icon [name]="'file-image'" [size]="20" class="text-indigo-500"></lucide-icon>
              <div class="selected-file-details">
                <span class="selected-file-name">{{ file.name }}</span>
                <span class="selected-file-size">{{ formatFileSize(file.size) }}</span>
              </div>
            </div>
            <button
              type="button"
              class="remove-file-button"
              (click)="removeFile(i)"
            >
              <lucide-icon [name]="'x'" [size="16"></lucide-icon>
            </button>
          </div>
        </div>

        <!-- Upload Actions -->
        <div class="upload-actions">
          <button
            type="button"
            class="upload-button"
            [disabled]="isUploading || selectedFiles.length === 0"
            (click)="startUpload()"
          >
            <lucide-icon [name]="'upload'" [size="18" class="mr-2"></lucide-icon>
            Upload {{ selectedFiles.length }} File{{ selectedFiles.length !== 1 ? 's' : '' }}
          </button>
          <button
            type="button"
            class="clear-button"
            (click)="clearSelection()"
          >
            Clear Selection
          </button>
        </div>

        <!-- Error Messages -->
        <div *ngIf="validationResult.errors.length > 0" class="error-messages">
          <div *ngFor="let error of validationResult.errors" class="error-message">
            {{ error }}
          </div>
        </div>
      </div>

      <!-- Upload Progress -->
      <div *ngIf="isUploading" class="upload-progress">
        <div class="upload-progress-header">
          <h4 class="upload-progress-title">Uploading Files...</h4>
          <button
            type="button"
            class="cancel-upload-button"
            (click)="cancelUpload()"
          >
            Cancel
          </button>
        </div>

        <div class="upload-progress-list">
          <div *ngFor="let fileProgress of fileProgresses" class="upload-progress-item">
            <div class="upload-progress-info">
              <span class="upload-progress-name">{{ fileProgress.name }}</span>
              <span class="upload-progress-percentage">{{ fileProgress.progress | number:'1.0-0' }}%</span>
            </div>
            <div class="upload-progress-bar">
              <div class="upload-progress-fill" [style.width.%]="fileProgress.progress"></div>
            </div>
          </div>
        </div>

        <div class="upload-progress-summary">
          <div class="upload-progress-total">
            Total: {{ overallProgress | number:'1.0-0' }}%
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .upload-container {
      width: 100%;
    }

    .drop-zone {
      border: 2px dashed #d1d5db;
      border-radius: 12px;
      padding: 40px;
      text-align: center;
      transition: all 0.3s ease;
      cursor: pointer;
      position: relative;
      background: #f9fafb;
    }

    .drop-zone.drag-over {
      border-color: #6366f1;
      background: #eef2ff;
      transform: scale(1.02);
    }

    .drop-zone.uploading {
      pointer-events: none;
      opacity: 0.7;
    }

    .drop-zone-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }

    .drop-zone-icon {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .drop-zone-title {
      font-size: 24px;
      font-weight: bold;
      color: #1f2937;
      margin: 0;
    }

    .drop-zone-subtitle {
      color: #6b7280;
      margin: 0;
    }

    .browse-button {
      background: #6366f1;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    .browse-button:hover {
      background: #4f46e5;
    }

    .drop-zone-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(99, 102, 241, 0.9);
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
    }

    .drop-zone-overlay-title {
      color: white;
      font-size: 28px;
      font-weight: bold;
      margin: 0;
    }

    .drop-zone-overlay-subtitle {
      color: rgba(255, 255, 255, 0.9);
      font-size: 16px;
      margin: 0;
    }

    .selected-files {
      margin-top: 20px;
    }

    .selected-files-title {
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 12px 0;
    }

    .selected-files-list {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      overflow: hidden;
    }

    .selected-file-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      border-bottom: 1px solid #f3f4f6;
    }

    .selected-file-item:last-child {
      border-bottom: none;
    }

    .selected-file-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .selected-file-name {
      font-weight: 500;
      color: #1f2937;
    }

    .selected-file-size {
      color: #6b7280;
      font-size: 14px;
    }

    .remove-file-button {
      background: none;
      border: none;
      color: #ef4444;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: background 0.2s;
    }

    .remove-file-button:hover {
      background: #fee2e2;
    }

    .upload-actions {
      display: flex;
      gap: 12px;
      margin-top: 16px;
    }

    .upload-button {
      flex: 1;
      background: #10b981;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    .upload-button:hover:not(:disabled) {
      background: #059669;
    }

    .upload-button:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }

    .clear-button {
      background: #f3f4f6;
      color: #6b7280;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
    }

    .clear-button:hover {
      background: #e5e7eb;
    }

    .error-messages {
      margin-top: 12px;
      padding: 12px;
      background: #fee2e2;
      border-radius: 8px;
      border: 1px solid #fecaca;
    }

    .error-message {
      color: #dc2626;
      font-size: 14px;
      margin: 4px 0;
    }

    .upload-progress {
      margin-top: 20px;
    }

    .upload-progress-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .upload-progress-title {
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
    }

    .cancel-upload-button {
      background: #ef4444;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
    }

    .cancel-upload-button:hover {
      background: #dc2626;
    }

    .upload-progress-list {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      overflow: hidden;
    }

    .upload-progress-item {
      padding: 12px 16px;
      border-bottom: 1px solid #f3f4f6;
    }

    .upload-progress-item:last-child {
      border-bottom: none;
    }

    .upload-progress-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .upload-progress-name {
      font-weight: 500;
      color: #1f2937;
    }

    .upload-progress-percentage {
      color: #6b7280;
      font-size: 14px;
      font-weight: 600;
    }

    .upload-progress-bar {
      height: 4px;
      background: #f3f4f6;
      border-radius: 2px;
      overflow: hidden;
    }

    .upload-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%);
      transition: width 0.3s ease;
    }

    .upload-progress-summary {
      margin-top: 16px;
      padding: 16px;
      background: #f9fafb;
      border-radius: 8px;
      text-align: center;
    }

    .upload-progress-total {
      font-size: 16px;
      font-weight: 600;
      color: #6366f1;
    }
  `]
})
export class UploadComponent {
  @Output() uploadComplete = new EventEmitter<any[]>();
  @Output() uploadCancelled = new EventEmitter<void>();

  isDragging = false;
  isUploading = false;
  selectedFiles: File[] = [];
  fileProgresses: { name: string; progress: number }[] = [];
  overallProgress = 0;
  uploadCompleteCount = 0;
  validationResult: FileValidationResult = {
    valid: true,
    files: [],
    errors: []
  };

  constructor(
    private dragDropService: DragDropService,
    private firebaseService: FirebaseService,
    private analyticsService: AnalyticsService
  ) {
    // Subscribe to drag events
    this.dragDropService.dragEnter$.subscribe(() => {
      this.isDragging = true;
    });

    this.dragDropService.dragLeave$.subscribe(() => {
      this.isDragging = false;
    });
  }

  onDragEnter(event: DragEvent): void {
    this.dragDropService.onDragEnter(event);
  }

  onDragOver(event: DragEvent): void {
    this.dragDropService.onDragOver(event);
  }

  onDragLeave(event: DragEvent): void {
    this.dragDropService.onDragLeave(event);
  }

  onDrop(event: DragEvent): void {
    this.dragDropService.reset();
    this.validationResult = this.dragDropService.onDrop(event);

    if (this.validationResult.valid) {
      this.selectedFiles = [...this.validationResult.files];
    }
  }

  triggerFileSelect(): void {
    const fileInput = document.querySelector('#fileInput') as HTMLInputElement;
    fileInput?.click();
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (files && files.length > 0) {
      this.validationResult = this.dragDropService.validateFiles(files);

      if (this.validationResult.valid) {
        this.selectedFiles = Array.from(files);
      }
    }
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  clearSelection(): void {
    this.selectedFiles = [];
    this.validationResult = {
      valid: true,
      files: [],
      errors: []
    };
    const fileInput = document.querySelector('#fileInput') as HTMLInputElement;
    fileInput.value = '';
  }

  async startUpload(): Promise<void> {
    if (this.selectedFiles.length === 0) return;

    this.isUploading = true;
    this.fileProgresses = this.selectedFiles.map(file => ({
      name: file.name,
      progress: 0
    }));
    this.uploadCompleteCount = 0;

    // Track batch upload
    this.analyticsService.trackBatchUpload(
      this.selectedFiles.length,
      this.selectedFiles.reduce((total, file) => total + file.size, 0),
      true
    );

    try {
      const uploadResults = await this.firebaseService.uploadFiles(
        this.selectedFiles,
        'images'
      ).toPromise();

      if (uploadResults) {
        this.uploadComplete.emit(uploadResults);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      this.isUploading = false;
    }
  }

  cancelUpload(): void {
    this.isUploading = false;
    this.uploadCancelled.emit();
    this.clearSelection();
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}