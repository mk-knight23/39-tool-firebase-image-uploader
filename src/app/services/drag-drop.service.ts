import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

export interface DragEventData {
  type: 'dragenter' | 'dragover' | 'dragleave' | 'drop';
  files?: FileList;
  event: DragEvent;
}

export interface FileValidationResult {
  valid: boolean;
  files: File[];
  errors: string[];
}

@Injectable({
  providedIn: 'root'
})
export class DragDropService {
  private dragEnterSubject = new Subject<void>();
  private dragOverSubject = new Subject<void>();
  private dragLeaveSubject = new Subject<void>();
  private dropSubject = new Subject<FileList>();

  public dragEnter$ = this.dragEnterSubject.asObservable();
  public dragOver$ = this.dragOverSubject.asObservable();
  public dragLeave$ = this.dragLeaveSubject.asObservable();
  public drop$ = this.dropSubject.asObservable();

  private isDraggingOver = false;
  private dragCounter = 0;

  /**
   * Handle drag enter events
   */
  onDragEnter(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.dragCounter++;
    if (this.dragCounter === 1) {
      this.isDraggingOver = true;
      this.dragEnterSubject.next();
    }
  }

  /**
   * Handle drag over events
   */
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.dragOverSubject.next();

    // Add visual feedback
    this.addDragOverStyle(event);
  }

  /**
   * Handle drag leave events
   */
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.dragCounter--;
    if (this.dragCounter <= 0) {
      this.isDraggingOver = false;
      this.dragLeaveSubject.next();
      this.removeDragOverStyle(event);
    }
  }

  /**
   * Handle drop events
   */
  onDrop(event: DragEvent): FileValidationResult {
    event.preventDefault();
    event.stopPropagation();

    this.dragCounter = 0;
    this.isDraggingOver = false;
    this.removeDragOverStyle(event);

    const files = event.dataTransfer?.files;
    if (!files || files.length === 0) {
      return {
        valid: false,
        files: [],
        errors: ['No files were dropped']
      };
    }

    return this.validateFiles(files);
  }

  /**
   * Validate dropped files
   */
  validateFiles(files: FileList): FileValidationResult {
    const validFiles: File[] = [];
    const errors: string[] = [];

    // Convert FileList to array
    const filesArray = Array.from(files);

    for (const file of filesArray) {
      // Check if it's an image
      if (!file.type.startsWith('image/')) {
        errors.push(`"${file.name}" is not an image file`);
        continue;
      }

      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        errors.push(`"${file.name}" is too large (max 10MB)`);
        continue;
      }

      // Check if file is empty
      if (file.size === 0) {
        errors.push(`"${file.name}" is empty`);
        continue;
      }

      validFiles.push(file);
    }

    return {
      valid: errors.length === 0,
      files: validFiles,
      errors
    };
  }

  /**
   * Add visual feedback for drag over state
   */
  private addDragOverStyle(event: Event): void {
    const target = event.currentTarget as HTMLElement;
    if (target.classList.contains('drop-zone')) {
      target.classList.add('drag-over');
    }
  }

  /**
   * Remove visual feedback for drag over state
   */
  private removeDragOverStyle(event: Event): void {
    const target = event.currentTarget as HTMLElement;
    if (target.classList.contains('drop-zone')) {
      target.classList.remove('drag-over');
    }
  }

  /**
   * Reset drag state
   */
  reset(): void {
    this.dragCounter = 0;
    this.isDraggingOver = false;
  }

  /**
   * Check if element is being dragged over
   */
  isDragging(): boolean {
    return this.isDraggingOver;
  }
}