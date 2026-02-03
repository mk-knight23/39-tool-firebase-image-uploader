import { Injectable } from '@angular/core';
import {
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  list,
  listAll
} from 'firebase/storage';
import { Observable, from, throwError, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { ImageAsset } from '../types/image';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor() {}

  /**
   * Upload a file to Firebase Storage
   */
  uploadFile(file: File, path: string = 'images'): Observable<{ progress: number; downloadUrl: string }> {
    const filePath = `${path}/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, filePath);

    return from(uploadBytesResumable(storageRef, file)).pipe(
      switchMap((task) => {
        return new Observable<{ progress: number; downloadUrl: string }>(observer => {
          // Subscribe to state changes, errors, and completion of the upload
          task.on('state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              observer.next({ progress, downloadUrl: '' });
            },
            (error) => {
              observer.error(error);
            },
            () => {
              // Upload completed successfully, now get the download URL
              getDownloadURL(task.snapshot.ref).then((downloadUrl) => {
                observer.next({ progress: 100, downloadUrl });
                observer.complete();
              });
            }
          );
        });
      }),
      catchError(error => {
        console.error('Upload failed:', error);
        return throwError(() => new Error('Upload failed: ' + error.message));
      })
    );
  }

  /**
   * Upload multiple files (batch upload)
   */
  uploadFiles(files: File[], path: string = 'images'): Observable<{
    fileId: string;
    progress: number;
    downloadUrl: string;
    file: File;
  }[]> {
    const uploadObservables = files.map((file, index) => {
      const fileId = `file_${index}_${Date.now()}`;
      return this.uploadFile(file, path).pipe(
        map(({ progress, downloadUrl }) => ({
          fileId,
          progress,
          downloadUrl,
          file
        }))
      );
    });

    // Combine all upload observables
    return from(Promise.all(uploadObservables));
  }

  /**
   * Get image URL
   */
  getImageUrl(path: string): Promise<string> {
    const imageRef = ref(storage, path);
    return getDownloadURL(imageRef);
  }

  /**
   * Delete an image from Firebase Storage
   */
  deleteImage(path: string): Promise<void> {
    const imageRef = ref(storage, path);
    return deleteObject(imageRef);
  }

  /**
   * List all images in a directory
   */
  listImages(path: string = 'images'): Observable<ImageAsset[]> {
    const listRef = ref(storage, path);

    return from(listAll(listRef)).pipe(
      switchMap((result) => {
        const downloadUrlPromises = result.items.map((item) =>
          getDownloadURL(item).then((url) => ({
            id: item.name,
            url,
            name: item.name,
            size: 0, // Firebase doesn't provide size directly
            type: 'image',
            path: item.fullPath,
            uploadedAt: new Date().toISOString(),
            status: 'completed' as const
          }))
        );

        return from(Promise.all(downloadUrlPromises));
      }),
      catchError(error => {
        console.error('Failed to list images:', error);
        return of([]);
      })
    );
  }
}