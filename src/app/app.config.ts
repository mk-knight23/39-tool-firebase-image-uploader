import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom, ErrorHandler } from '@angular/core';
import { GlobalErrorHandler } from './core/errors/global-error-handler';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {
  LucideAngularModule,
  CloudUpload,
  Image as ImageIcon,
  LayoutGrid,
  Trash2,
  Share2,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal,
  Search,
  Plus,
  Github,
  Sun,
  Moon,
  LogOut,
  Files
} from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    importProvidersFrom(LucideAngularModule.pick({
      CloudUpload,
      ImageIcon,
      LayoutGrid,
      Trash2,
      Share2,
      CheckCircle2,
      AlertCircle,
      MoreHorizontal,
      Search,
      Plus,
      Github,
      Sun,
      Moon,
      LogOut,
      Files
    }))
  ]
};
