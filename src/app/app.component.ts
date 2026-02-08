import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CloudUpload,
  Image as ImageIcon,
  LayoutGrid,
  Trash2,
  Share2,
  Heart,
  Download,
  Search,
  Plus,
  Moon,
  Sun,
  Settings,
  X,
  Filter,
  Grid3x3,
  List,
  Eye
} from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../services/settings.service';
import { StatsService } from '../services/stats.service';
import { AudioService } from '../services/audio.service';
import { FirebaseService } from './services/firebase.service';
import { SettingsPanelComponent } from '../components/ui/settings-panel.component';
import { firstValueFrom } from 'rxjs';

interface GalleryImage {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
  url: string;
  category: string;
  dimensions: string;
  liked?: boolean;
  aspectRatio?: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule, SettingsPanelComponent],
  template: `
    <div class="min-h-screen bg-gallery-bg dark:bg-[#0a0a0a] transition-colors duration-300">

      <!-- Header -->
      <header class="sticky top-0 z-40 bg-gallery-surface/80 dark:bg-[#171717]/80 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800">
        <div class="max-w-7xl mx-auto px-6 py-4">
          <div class="flex items-center justify-between">
            <!-- Logo -->
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
                <lucide-icon [name]="'image'" [size]="24"></lucide-icon>
              </div>
              <div>
                <h1 class="text-xl font-black tracking-tight text-gallery-text-primary dark:text-white">Visual<span class="text-indigo-500">Vault</span></h1>
                <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-gallery-text-muted">Creative Asset Manager</p>
              </div>
            </div>

            <!-- Search Bar -->
            <div class="hidden md:flex flex-1 max-w-lg mx-8">
              <div class="relative w-full">
                <lucide-icon [name]="'search'" class="absolute left-4 top-1/2 -translate-y-1/2 text-gallery-text-muted" [size]="18"></lucide-icon>
                <input
                  type="text"
                  placeholder="Search your visual library..."
                  class="search-input"
                >
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-3">
              <button
                (click)="toggleTheme()"
                class="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-gallery-text-primary hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all"
              >
                <lucide-icon [name]="settingsService.isDarkMode() ? 'sun' : 'moon'" [size]="20"></lucide-icon>
              </button>
              <button
                (click)="openSettings()"
                class="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-gallery-text-primary hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all"
              >
                <lucide-icon [name]="'settings'" [size]="20"></lucide-icon>
              </button>
              <button
                (click)="triggerUpload()"
                class="btn-gallery-primary flex items-center gap-2"
              >
                <lucide-icon [name]="'plus'" [size]="18"></lucide-icon>
                <span class="hidden sm:inline">Upload</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-6 py-8">
        <!-- Hidden File Input -->
        <input
          type="file"
          id="fileInput"
          class="hidden"
          accept="image/*"
          (change)="handleFileSelect($event)"
        />

        <!-- Upload Section -->
        <section class="mb-12 animate-fade-in">
          <!-- Upload Zone -->
          <div *ngIf="!previewImage && !isUploading" class="upload-zone p-16 text-center cursor-pointer" (click)="triggerUpload()">
            <div class="space-y-6">
              <div class="w-20 h-20 bg-gradient-to-br from-indigo-100 to-pink-100 dark:from-indigo-900/30 dark:to-pink-900/30 text-indigo-500 rounded-3xl flex items-center justify-center mx-auto">
                <lucide-icon [name]="'cloud-upload'" [size]="40"></lucide-icon>
              </div>
              <div>
                <h3 class="text-2xl font-bold text-gallery-text-primary dark:text-white mb-2">Drop your masterpieces here</h3>
                <p class="text-gallery-text-secondary">Supports PNG, JPG, WebP up to 10MB</p>
              </div>
              <button class="text-indigo-500 font-bold text-sm uppercase tracking-wider hover:underline">
                Or browse files
              </button>
            </div>
          </div>

          <!-- Preview & Upload Progress -->
          <div *ngIf="previewImage || isUploading" class="upload-zone p-8">
            <div class="flex flex-col md:flex-row items-center gap-8">
              <!-- Preview -->
              <div class="w-full md:w-1/3">
                <img [src]="previewImage" alt="Preview" class="w-full h-48 object-cover rounded-xl">
              </div>

              <!-- Progress -->
              <div class="flex-1 w-full">
                <div *ngIf="isUploading">
                  <div class="flex justify-between mb-2">
                    <span class="font-bold text-gallery-text-primary dark:text-white">Uploading...</span>
                    <span class="text-indigo-500 font-bold">{{ uploadProgress | number:'1.0-0' }}%</span>
                  </div>
                  <div class="h-3 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-indigo-500 to-pink-500 transition-all duration-300" [style.width.%]="uploadProgress"></div>
                  </div>
                  <button (click)="cancelUpload()" class="mt-4 text-red-500 text-sm font-bold hover:underline">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Gallery Stats -->
        <section class="mb-8">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">{{ images.length }}</div>
              <div class="stat-label">Total Assets</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ likedCount }}</div>
              <div class="stat-label">Favorites</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">4.2</div>
              <div class="stat-label">GB Used</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">99%</div>
              <div class="stat-label">Uptime</div>
            </div>
          </div>
        </section>

        <!-- Filter Bar -->
        <section class="mb-8">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div class="section-header mb-0">
              <span class="section-title">Your Collection</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="flex gap-2">
                <button
                  *ngFor="let category of categories"
                  (click)="selectedCategory = category"
                  [class.active]="selectedCategory === category"
                  class="collection-tag"
                >
                  {{ category }}
                </button>
              </div>
              <div class="flex gap-2 ml-4">
                <button class="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-gallery-text-primary">
                  <lucide-icon [name]="'grid-3x-3'" [size]="18"></lucide-icon>
                </button>
                <button class="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-gallery-text-primary hover:bg-neutral-200 dark:hover:bg-neutral-700">
                  <lucide-icon [name]="'list'" [size]="18"></lucide-icon>
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Gallery Grid -->
        <section class="masonry-grid">
          <div *ngFor="let img of filteredImages; trackBy: trackById" class="masonry-item animate-scale-in">
            <div class="gallery-card group" [style.aspect-ratio]="img.aspectRatio || '4/3'">
              <!-- Image -->
              <div class="relative overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                <img
                  [src]="img.url"
                  [alt]="img.name"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  (click)="openLightbox(img)"
                >

                <!-- Overlay -->
                <div class="image-overlay"></div>

                <!-- Stats Badge -->
                <div class="image-stats">
                  <span class="badge badge-primary">{{ img.size }} KB</span>
                </div>

                <!-- Action Bar -->
                <div class="action-bar">
                  <button
                    (click)="toggleLike(img); $event.stopPropagation()"
                    class="action-btn"
                    [class.text-pink-500]="img.liked"
                  >
                    <lucide-icon [name]="'heart'" [size]="18" [class.fill-current]="img.liked"></lucide-icon>
                  </button>
                  <button (click)="shareImage(img); $event.stopPropagation()" class="action-btn">
                    <lucide-icon [name]="'share-2'" [size]="18"></lucide-icon>
                  </button>
                  <button (click)="downloadImage(img); $event.stopPropagation()" class="action-btn">
                    <lucide-icon [name]="'download'" [size]="18"></lucide-icon>
                  </button>
                  <button (click)="openLightbox(img)" class="action-btn">
                    <lucide-icon [name]="'eye'" [size]="18"></lucide-icon>
                  </button>
                </div>
              </div>

              <!-- Card Info -->
              <div class="p-4">
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-bold truncate text-gallery-text-primary dark:text-white">{{ img.name }}</p>
                    <p class="text-xs text-gallery-text-muted mt-1">{{ img.dimensions }} • {{ img.uploadedAt }}</p>
                  </div>
                  <button (click)="toggleLike(img)" class="flex-shrink-0">
                    <lucide-icon
                      [name]="'heart'"
                      [size]="18"
                      [class.text-pink-500]="img.liked"
                      [class.text-gallery-text-muted]="!img.liked"
                      [class.fill-current]="img.liked"
                    ></lucide-icon>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <!-- Lightbox Modal -->
      <div *ngIf="selectedImage" class="lightbox-backdrop flex items-center justify-center p-4" (click)="closeLightbox()">
        <div class="lightbox-content flex flex-col lg:flex-row max-h-[90vh]" (click)="$event.stopPropagation()">
          <!-- Close Button -->
          <button
            (click)="closeLightbox()"
            class="absolute top-4 right-4 z-10 p-3 bg-black/50 hover:bg-black/70 text-white rounded-xl transition-all"
          >
            <lucide-icon [name]="'x'" [size]="24"></lucide-icon>
          </button>

          <!-- Image Preview -->
          <div class="flex-1 overflow-hidden bg-black flex items-center justify-center">
            <img [src]="selectedImage.url" [alt]="selectedImage.name" class="max-w-full max-h-[60vh] lg:max-h-[90vh] object-contain">
          </div>

          <!-- Image Details -->
          <div class="w-full lg:w-96 p-8 bg-white dark:bg-[#171717] flex flex-col">
            <span class="badge badge-primary self-start mb-4">{{ selectedImage.category }}</span>
            <h2 class="text-2xl font-black text-gallery-text-primary dark:text-white mb-4">{{ selectedImage.name }}</h2>

            <div class="space-y-4 text-sm text-gallery-text-secondary mb-8">
              <div class="flex justify-between">
                <span>Dimensions</span>
                <span class="font-bold text-gallery-text-primary dark:text-white">{{ selectedImage.dimensions }}</span>
              </div>
              <div class="flex justify-between">
                <span>File Size</span>
                <span class="font-bold text-gallery-text-primary dark:text-white">{{ selectedImage.size }} KB</span>
              </div>
              <div class="flex justify-between">
                <span>Uploaded</span>
                <span class="font-bold text-gallery-text-primary dark:text-white">{{ selectedImage.uploadedAt }}</span>
              </div>
            </div>

            <div class="mt-auto space-y-3">
              <button class="w-full btn-gallery-primary flex items-center justify-center gap-2">
                <lucide-icon [name]="'download'" [size]="18"></lucide-icon>
                Download Original
              </button>
              <div class="grid grid-cols-2 gap-3">
                <button class="btn-gallery-secondary flex items-center justify-center gap-2">
                  <lucide-icon [name]="'heart'" [size]="18"></lucide-icon>
                  {{ selectedImage.liked ? 'Liked' : 'Like' }}
                </button>
                <button class="btn-gallery-secondary flex items-center justify-center gap-2">
                  <lucide-icon [name]="'share-2'" [size]="18"></lucide-icon>
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <app-settings-panel />

      <!-- Footer -->
      <footer class="border-t border-neutral-200 dark:border-neutral-800 py-6 px-6 mt-12">
        <div class="max-w-7xl mx-auto text-center">
          <p class="text-indigo-500 text-xs font-bold uppercase tracking-[0.3em] mb-2">
            Made by MK — Musharraf Kazi
          </p>
          <p class="text-neutral-500 text-xs">
            © 2026 Firebase Gallery. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class AppComponent implements OnInit {
  public settingsService = inject(SettingsService);
  private statsService = inject(StatsService);
  private audioService = inject(AudioService);
  private firebaseService = inject(FirebaseService);

  selectedCategory = 'All';
  selectedImage: GalleryImage | null = null;

  get likedCount(): number {
    return this.images.filter(i => i.liked).length;
  }

  categories = ['All', 'Photography', 'Design', '3D Art', 'Vectors'];

  images: GalleryImage[] = [
    {
      id: '1',
      name: 'Abstract Composition 01',
      size: 1240,
      uploadedAt: '2 hours ago',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
      category: 'Design',
      dimensions: '1920 × 1280',
      liked: true,
      aspectRatio: '4/3'
    },
    {
      id: '2',
      name: 'Urban Architecture',
      size: 2100,
      uploadedAt: '1 day ago',
      url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
      category: 'Photography',
      dimensions: '2400 × 1600',
      liked: false,
      aspectRatio: '3/2'
    },
    {
      id: '3',
      name: 'Neon Dreamscape',
      size: 890,
      uploadedAt: '3 days ago',
      url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80',
      category: '3D Art',
      dimensions: '1920 × 1080',
      liked: true,
      aspectRatio: '16/9'
    },
    {
      id: '4',
      name: 'Minimal Patterns',
      size: 450,
      uploadedAt: '5 days ago',
      url: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&q=80',
      category: 'Vectors',
      dimensions: '1200 × 1200',
      liked: false,
      aspectRatio: '1/1'
    },
    {
      id: '5',
      name: 'Cyber Portrait',
      size: 1560,
      uploadedAt: '1 week ago',
      url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
      category: '3D Art',
      dimensions: '1080 × 1350',
      liked: false,
      aspectRatio: '4/5'
    },
    {
      id: '6',
      name: 'Brand Identity',
      size: 780,
      uploadedAt: '2 weeks ago',
      url: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?w=800&q=80',
      category: 'Design',
      dimensions: '1600 × 1200',
      liked: true,
      aspectRatio: '4/3'
    }
  ];

  get filteredImages(): GalleryImage[] {
    if (this.selectedCategory === 'All') {
      return this.images;
    }
    return this.images.filter(img => img.category === this.selectedCategory);
  }

  async loadRealImages() {
    try {
      this.firebaseService.listImages().subscribe({
        next: (realImages: any[]) => {
          this.images = realImages.map(img => ({
            ...img,
            uploadedAt: new Date(img.uploadedAt).toLocaleDateString(),
            aspectRatio: '4/3'
          }));
        }
      });
    } catch (error) {
      console.error('Failed to load real images', error);
    }
  }

  ngOnInit(): void {
    this.statsService.recordVisit();
    this.loadRealImages();
  }

  toggleTheme(): void {
    this.audioService.playClick();
    this.settingsService.toggleTheme();
    this.statsService.recordThemeSwitch();
  }

  openSettings(): void {
    this.audioService.playClick();
    this.settingsService.toggleHelp();
    this.statsService.recordSettingsOpen();
  }

  previewImage: string | null = null;
  isUploading = false;
  uploadProgress = 0;

  triggerUpload(): void {
    this.statsService.recordClick();
    document.getElementById('fileInput')?.click();
  }

  uploadFile(file: File): void {
    this.isUploading = true;
    this.uploadProgress = 0;

    this.firebaseService.uploadFile(file).subscribe({
      next: (res: any) => {
        const { progress, downloadUrl } = res;
        this.uploadProgress = progress;
        if (downloadUrl) {
          // Add to gallery
          const newImage: GalleryImage = {
            id: Date.now().toString(),
            name: file.name,
            size: Math.round(file.size / 1024),
            uploadedAt: 'Just now',
            url: downloadUrl,
            category: 'Photography',
            dimensions: 'Unknown',
            liked: false,
            aspectRatio: '4/3'
          };

          this.images.unshift(newImage);
          this.isUploading = false;
          this.previewImage = null;
          this.audioService.playSuccess();
        }
      },
      error: (err) => {
        this.isUploading = false;
        this.previewImage = null;
        alert(err.message || 'Upload failed');
        this.audioService.playError();
      }
    });
  }

  handleFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WebP)');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    // Read and preview image
    const reader = new FileReader();
    reader.onload = (e) => {
      this.previewImage = e.target?.result as string;
      this.uploadFile(file);
    };
    reader.readAsDataURL(file);
  }

  cancelUpload(): void {
    this.previewImage = null;
    this.isUploading = false;
    this.uploadProgress = 0;
  }

  toggleLike(image: GalleryImage): void {
    this.statsService.recordClick();
    image.liked = !image.liked;
  }

  shareImage(image: GalleryImage): void {
    this.statsService.recordClick();
  }

  downloadImage(image: GalleryImage): void {
    this.statsService.recordClick();
  }

  openLightbox(image: GalleryImage): void {
    this.statsService.recordImageView();
    this.selectedImage = image;
  }

  closeLightbox(): void {
    this.selectedImage = null;
  }

  trackById(index: number, image: GalleryImage): string {
    return image.id;
  }
}
