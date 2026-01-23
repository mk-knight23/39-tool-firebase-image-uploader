import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
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
