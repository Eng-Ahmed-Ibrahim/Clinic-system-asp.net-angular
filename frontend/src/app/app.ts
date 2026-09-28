import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { ToastContainerComponent } from './shared/components/toast-container/toast-container.component';
import { TranslationService } from './core/services/translation.service';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    SidebarComponent,
    ToastContainerComponent,
  ],
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly t = inject(TranslationService);
  protected readonly theme = inject(ThemeService);

  readonly isSidebarCollapsed = signal(false);
  readonly isMobileSidebarOpen = signal(false);

  toggleSidebar(): void {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      this.isMobileSidebarOpen.update((v) => !v);
    } else {
      this.isSidebarCollapsed.update((v) => !v);
    }
  }

  closeMobileSidebar(): void {
    this.isMobileSidebarOpen.set(false);
  }
}
