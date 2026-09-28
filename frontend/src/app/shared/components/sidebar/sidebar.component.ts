import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Mobile Backdrop -->
    @if (mobileOpen) {
      <div
        class="fixed inset-0 z-40 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs lg:hidden transition-opacity duration-300"
        (click)="closeMobile.emit()"
        aria-hidden="true"
      ></div>
    }

    <!-- Sidebar Container -->
    <aside
      class="fixed inset-y-0 start-0 z-40 flex flex-col justify-between border-e border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 ease-in-out lg:static lg:translate-x-0"
      [ngClass]="{
        'w-64': !collapsed,
        'w-20': collapsed,
        'translate-x-0 shadow-2xl': mobileOpen,
        '-translate-x-full rtl:translate-x-full lg:translate-x-0': !mobileOpen
      }"
    >
      <!-- Top Branding -->
      <div>
        <div class="flex h-16 items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800/80">
          <a routerLink="/" class="flex items-center gap-3 overflow-hidden" (click)="closeMobile.emit()">
            <!-- Brand Icon -->
            <div
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-400 text-white shadow-md shadow-teal-500/20"
            >
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.5"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>

            <!-- Brand Texts -->
            @if (!collapsed) {
              <div class="min-w-0 transition-opacity duration-200">
                <h1 class="text-base font-extrabold tracking-tight text-slate-900 dark:text-white truncate">
                  {{ t.t('appName') }}
                </h1>
                <p class="text-[10px] font-medium text-teal-600 dark:text-teal-400 truncate">
                  {{ t.t('appSubtitle') }}
                </p>
              </div>
            }
          </a>

          <!-- Mobile Close Button -->
          <button
            type="button"
            (click)="closeMobile.emit()"
            class="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 lg:hidden"
            aria-label="Close sidebar"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Navigation Links -->
        <nav class="space-y-1.5 p-3">
          <!-- 1. Dashboard Overview -->
          <a
            routerLink="/"
            routerLinkActive="bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300 font-semibold shadow-2xs"
            [routerLinkActiveOptions]="{ exact: true }"
            (click)="closeMobile.emit()"
            class="group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            [title]="t.t('navDashboard')"
          >
            <svg
              class="w-5 h-5 shrink-0 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
              />
            </svg>
            @if (!collapsed) {
              <span class="truncate">{{ t.t('navDashboard') }}</span>
            }
          </a>

          <!-- 2. Patients & Clinical Records -->
          <a
            routerLink="/patients"
            routerLinkActive="bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300 font-semibold shadow-2xs"
            (click)="closeMobile.emit()"
            class="group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            [title]="t.t('navPatients')"
          >
            <div class="flex items-center gap-3 min-w-0">
              <svg
                class="w-5 h-5 shrink-0 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              @if (!collapsed) {
                <span class="truncate">{{ t.t('navPatients') }}</span>
              }
            </div>
            @if (!collapsed) {
              <span
                class="rounded-full bg-teal-100 dark:bg-teal-900/60 px-2 py-0.5 text-[11px] font-bold text-teal-700 dark:text-teal-300"
              >
                12
              </span>
            }
          </a>

          <!-- 3. UI Components Showcase -->
          <a
            routerLink="/components"
            routerLinkActive="bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300 font-semibold shadow-2xs"
            (click)="closeMobile.emit()"
            class="group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            [title]="t.t('navComponents')"
          >
            <svg
              class="w-5 h-5 shrink-0 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            @if (!collapsed) {
              <span class="truncate">{{ t.t('navComponents') }}</span>
            }
          </a>

          <!-- 4. Doctor Profile & Security -->
          <a
            routerLink="/profile"
            routerLinkActive="bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300 font-semibold shadow-2xs"
            (click)="closeMobile.emit()"
            class="group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            [title]="t.t('navProfile')"
          >
            <svg
              class="w-5 h-5 shrink-0 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            @if (!collapsed) {
              <span class="truncate">{{ t.t('navProfile') }}</span>
            }
          </a>
        </nav>
      </div>

      <!-- Bottom System / Status Card -->
      @if (!collapsed) {
        <div class="p-3 m-3 rounded-2xl bg-gradient-to-br from-teal-500/10 via-emerald-500/5 to-transparent border border-teal-500/20">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold text-slate-800 dark:text-slate-200">MediCore Cloud</span>
            <span class="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
            Encrypted EHR Vault · HIPAA Compliant
          </p>
          <div class="mt-2.5 flex items-center justify-between text-[10px] text-slate-400">
            <span>Storage: 68%</span>
            <span>v2.4.0</span>
          </div>
        </div>
      }
    </aside>
  `,
})
export class SidebarComponent {
  @Input() collapsed = false;
  @Input() mobileOpen = false;

  @Output() closeMobile = new EventEmitter<void>();

  protected readonly t = inject(TranslationService);
}
