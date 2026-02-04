import { Injectable } from '@angular/core';
import { Observable, from, throwError, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ImageAsset } from '../types/image';
import { initializeApp } from 'firebase/app';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  StorageReference,
  UploadTask,
  UploadTaskSnapshot
} from 'firebase/storage';

// Firebase configuration - should be moved to environment variables
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

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
    const storageRef: StorageReference = ref(storage, filePath);
    const task: UploadTask = uploadBytesResumable(storageRef, file);

    return new Observable<{ progress: number; downloadUrl: string }>(observer => {
      // Subscribe to state changes, errors, and completion of the upload
      task.on('state_changed',
        (snapshot: UploadTaskSnapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          observer.next({ progress, downloadUrl: '' });
        },
        (error: Error) => {
          observer.error(error);
        },
        async () => {
          // Upload completed successfully, now get the download URL
          try {
            const downloadUrl = await getDownloadURL(task.snapshot.ref);
            observer.next({ progress: 100, downloadUrl });
            observer.complete();
          } catch (error) {
            observer.error(error);
          }
        }
      );
    });
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
    return forkJoin(uploadObservables);
  }

  /**
   * Get image URL
   */
  async getImageUrl(path: string): Promise<string> {
    const imageRef: StorageReference = ref(storage, path);
    return getDownloadURL(imageRef);
  }

  /**
   * Delete an image from Firebase Storage
   */
  async deleteImage(path: string): Promise<void> {
    const imageRef: StorageReference = ref(storage, path);
    return deleteObject(imageRef);
  }

  /**
   * List all images in a directory
   */
  listImages(path: string = 'images'): Observable<ImageAsset[]> {
    const listRef: StorageReference = ref(storage, path);

    return from(listAll(listRef)).pipe(
      map((result) => {
        // Since we can't get metadata without additional calls,
        // we'll return what we can
        return result.items.map((item) => ({
          id: item.name,
          url: '', // Will be filled by caller
          name: item.name,
          size: 0,
          type: 'image',
          path: item.fullPath,
          uploadedAt: new Date().toISOString(),
          status: 'completed' as const
        }));
      }),
      catchError((error) => {
        console.error('Failed to list images:', error);
        return throwError(() => new Error('Failed to list images: ' + error.message));
      })
    );
  }
}
