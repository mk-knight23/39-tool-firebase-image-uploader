import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
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
import { LucideAngularModule } from 'lucide-angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  template: `
    <div class="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      
      <!-- Left Sidebar -->
      <aside class="w-20 lg:w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between h-screen sticky top-0 transition-all duration-300">
         <div class="p-6 lg:p-10 space-y-12 flex flex-col items-center lg:items-start">
            <div class="flex items-center space-x-3">
               <div class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-600/30">F</div>
               <span class="text-xl font-display font-black tracking-tight dark:text-white hidden lg:block uppercase">Firebase<span class="text-indigo-600">Hub</span></span>
            </div>

            <nav class="space-y-4 w-full">
               <div class="flex items-center space-x-3 px-4 py-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 cursor-pointer">
                  <lucide-icon [name]="'layout-grid'" [size]="20"></lucide-icon>
                  <span class="text-sm font-bold hidden lg:block">Gallery</span>
               </div>
               <div class="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer">
                  <lucide-icon [name]="'cloud-upload'" [size]="20"></lucide-icon>
                  <span class="text-sm font-bold hidden lg:block">Uploads</span>
               </div>
               <div class="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer">
                  <lucide-icon [name]="'files'" [size]="20"></lucide-icon>
                  <span class="text-sm font-bold hidden lg:block">Collections</span>
               </div>
            </nav>
         </div>

         <div class="p-6 lg:p-10 space-y-6">
            <button (click)="toggleTheme()" class="p-3 w-full rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-indigo-600 transition-all flex items-center justify-center lg:justify-start lg:space-x-3">
               <lucide-icon [name]="isDarkMode ? 'sun' : 'moon'" [size]="20"></lucide-icon>
               <span class="text-sm font-bold hidden lg:block">{{ isDarkMode ? 'Light Mode' : 'Dark Mode' }}</span>
            </button>
            <div class="flex items-center space-x-3 pt-6 border-t border-slate-100 dark:border-slate-800 justify-center lg:justify-start">
               <div class="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700"></div>
               <div class="flex flex-col hidden lg:flex min-w-0">
                  <span class="text-xs font-black truncate dark:text-white uppercase">M. Kazi</span>
                  <span class="text-[10px] font-bold text-slate-400">Pro Account</span>
               </div>
            </div>
         </div>
      </aside>

      <!-- Main Workspace -->
      <main class="flex-1 flex flex-col min-w-0">
         
         <!-- Top Bar -->
         <header class="h-24 border-b border-slate-200 dark:border-slate-800 px-8 lg:px-12 flex items-center justify-between sticky top-0 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md z-40 transition-all duration-300">
            <div class="flex items-center space-x-6 flex-1 min-w-0">
               <h2 class="text-2xl font-display font-black tracking-tight dark:text-white hidden sm:block">Assets Gallery</h2>
               <div class="relative w-full max-w-md group">
                  <lucide-icon [name]="'search'" class="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" [size]="16"></lucide-icon>
                  <input type="text" placeholder="Filter images..." class="w-full bg-white dark:bg-slate-900 border-none rounded-2xl pl-12 pr-6 py-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-indigo-600 transition-all">
               </div>
            </div>

            <div class="flex items-center space-x-4 ml-6">
               <button class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 lg:px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center space-x-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-95 whitespace-nowrap">
                  <lucide-icon [name]="'plus'" [size]="14"></lucide-icon>
                  <span class="hidden lg:inline">Add Assets</span>
               </button>
            </div>
         </header>

         <!-- Content -->
         <div class="flex-1 p-8 lg:p-12 space-y-16 overflow-y-auto custom-scrollbar">
            
            <!-- Upload Section -->
            <section class="space-y-8">
               <div class="flex items-center justify-between">
                  <h3 class="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Drag & Drop Uploader</h3>
               </div>
               
               <div class="drop-zone group">
                  <div class="space-y-6">
                     <div class="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500 shadow-inner">
                        <lucide-icon [name]="'cloud-upload'" [size]="40"></lucide-icon>
                     </div>
                     <div class="space-y-2">
                        <h4 class="text-2xl font-display font-black dark:text-white">Push to Cloud</h4>
                        <p class="text-slate-500 font-medium max-w-xs mx-auto italic">Supports PNG, JPG and WebP up to 10MB.</p>
                     </div>
                     <button class="text-indigo-600 font-black uppercase tracking-widest text-[10px] hover:underline">Or browse files manually</button>
                  </div>
               </div>
            </section>

            <!-- Gallery Grid -->
            <section class="space-y-8">
               <div class="flex items-center justify-between">
                  <h3 class="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Library Assets</h3>
                  <div class="flex items-center space-x-4">
                     <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sort: Recent</span>
                  </div>
               </div>

               <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
                  @for (img of images; track img.id) {
                     <div class="glass-card overflow-hidden group">
                        <div class="aspect-[4/3] relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                           <img [src]="img.url" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="">
                           <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4 backdrop-blur-sm">
                              <button class="p-3 bg-white/20 rounded-xl text-white hover:bg-white/40"><lucide-icon [name]="'share-2'" [size]="18"></lucide-icon></button>
                              <button class="p-3 bg-red-500/80 rounded-xl text-white hover:bg-red-600"><lucide-icon [name]="'trash-2'" [size]="18"></lucide-icon></button>
                           </div>
                           <div class="absolute top-4 left-4">
                              <span class="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-[8px] font-black uppercase tracking-widest text-white rounded-lg">
                                 {{ img.size }} KB
                              </span>
                           </div>
                        </div>
                        <div class="p-6 flex items-center justify-between">
                           <div class="min-w-0 space-y-0.5">
                              <p class="text-sm font-bold truncate dark:text-white uppercase tracking-tight">{{ img.name }}</p>
                              <p class="text-[10px] text-slate-400 font-medium italic">{{ img.uploadedAt }}</p>
                           </div>
                           <lucide-icon [name]="'more-horizontal'" class="text-slate-300" [size]="16"></lucide-icon>
                        </div>
                     </div>
                  }
               </div>
            </section>

         </div>

         <!-- Status Footer -->
         <footer class="h-16 border-t border-slate-200 dark:border-slate-800 px-8 lg:px-12 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            <div class="flex items-center space-x-4">
               <span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Firebase Online</span>
               <span class="w-1 h-1 bg-slate-300 rounded-full"></span>
               <span>v2.0 Stable Build</span>
            </div>
            <div class="flex items-center space-x-8">
               <a href="https://github.com/mk-knight23/49-Firebase-Image-Uploader" class="hover:text-indigo-600 transition-colors">Technical Specs</a>
               <a href="#" class="hover:text-indigo-600 transition-colors">Architecture Documentation</a>
            </div>
         </footer>

      </main>

    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class App {
  isDarkMode = true;
  images = [
    { id: '1', name: 'abstract_composition_01.webp', size: 1240, uploadedAt: '12 mins ago', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80' },
    { id: '2', name: 'architectural_study.jpg', size: 850, uploadedAt: '4 hours ago', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80' },
    { id: '3', name: 'brand_identity_mockup.png', size: 2100, uploadedAt: '1 day ago', url: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?w=800&q=80' },
    { id: '4', name: 'system_design_diagram.svg', size: 45, uploadedAt: '2 days ago', url: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&q=80' }
  ];

  constructor() {
    if (this.isDarkMode) document.documentElement.classList.add('dark');
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    document.documentElement.classList.toggle('dark');
  }
}
