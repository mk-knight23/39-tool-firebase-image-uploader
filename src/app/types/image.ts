export interface ImageAsset {
  id: string;
  url: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  status: 'uploading' | 'completed' | 'error';
  progress?: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}
