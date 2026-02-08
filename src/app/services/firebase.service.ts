import { Injectable } from '@angular/core';
import { Observable, from, throwError, forkJoin } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
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

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
import { getMetadata } from 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor() { }

  /**
   * Upload a file to Firebase Storage
   */
  uploadFile(file: File, path: string = 'images'): Observable<{ progress: number; downloadUrl: string }> {
    if (file.size > MAX_FILE_SIZE) {
      return throwError(() => new Error('File size exceeds 10MB limit'));
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return throwError(() => new Error('Unsupported file type. Please upload an image (JPG, PNG, GIF, WebP)'));
    }

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
      switchMap(async (result) => {
        const imagePromises = result.items.map(async (item) => {
          const url = await getDownloadURL(item);
          const metadata = await getMetadata(item);
          return {
            id: item.name,
            url,
            name: item.name,
            size: Math.round((metadata.size || 0) / 1024),
            type: metadata.contentType || 'image',
            path: item.fullPath,
            uploadedAt: metadata.timeCreated || new Date().toISOString(),
            status: 'completed' as const
          };
        });
        return Promise.all(imagePromises);
      }),
      catchError(error => {
        console.error('Failed to list images from Firebase:', error);
        return throwError(() => new Error('Cloud storage access failed. Verify your Firebase configuration.'));
      })
    );
  }
}
