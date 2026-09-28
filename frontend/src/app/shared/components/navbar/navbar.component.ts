import {
  Component,
  Output,
  EventEmitter,
  inject,
  signal,
  HostListener,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { TranslationService } from '../../../core/services/translation.service';
import { SearchInputComponent } from '../search-input/search-input.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, SearchInputComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header
      class="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 dark:border-slate-800 bg-white/85 dark:bg-slate-900/85 px-4 backdrop-blur-md sm:px-6 lg:px-8 transition-colors duration-200"
    >
      <!-- Left side: Hamburger Toggle & Search -->
      <div class="flex items-center gap-3 lg:gap-4 flex-1 max-w-xl">
        <!-- Sidebar Toggle (Mobile & Desktop) -->
        <button
          type="button"
          (click)="sidebarToggle.emit()"
          class="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          aria-label="Toggle navigation menu"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <!-- Search Input -->
        <div class="hidden sm:block flex-1">
          <app-search-input
            [placeholder]="t.t('searchPlaceholder')"
            [showShortcutBadge]="true"
            (search)="onGlobalSearch($event)"
          ></app-search-input>
        </div>
      </div>

      <!-- Right side controls: RTL/LTR toggle, Dark/Light toggle, Notifications, Profile -->
      <div class="flex items-center gap-1.5 sm:gap-2.5">
        <!-- RTL / LTR Language Switcher -->
        <button
          type="button"
          (click)="t.toggleLanguage()"
          class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 transition-all shadow-2xs"
          [title]="t.isRtl() ? 'Switch to English (LTR)' : 'التبديل إلى العربية (RTL)'"
        >
          <svg class="w-4 h-4 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
            />
          </svg>
          <span class="font-medium tracking-wide">
            {{ t.isRtl() ? 'English' : 'عربي' }}
          </span>
          <span
            class="text-[10px] uppercase font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-1 py-0.2 rounded"
          >
            {{ t.direction() }}
          </span>
        </button>

        <!-- Theme Toggle Button (Light / Dark) -->
        <button
          type="button"
          (click)="theme.toggleTheme()"
          class="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700/80 transition-all shadow-2xs"
          [attr.aria-label]="theme.isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
          [title]="theme.isDark() ? t.t('lightMode') : t.t('darkMode')"
        >
          @if (theme.isDark()) {
            <!-- Sun Icon for switching to light -->
            <svg class="w-4.5 h-4.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          } @else {
            <!-- Moon Icon for switching to dark -->
            <svg class="w-4.5 h-4.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          }
        </button>

        <!-- Notifications Dropdown -->
        <div class="relative">
          <button
            type="button"
            (click)="toggleNotifications()"
            class="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700/80 transition-all shadow-2xs"
            aria-label="View notifications"
          >
            <svg class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <!-- Badge -->
            <span
              class="absolute -top-1 -end-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs animate-pulse"
            >
              3
            </span>
          </button>

          <!-- Notifications Menu Popover -->
          @if (isNotificationsOpen()) {
            <div
              class="absolute end-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 p-4 shadow-2xl border border-slate-200/80 dark:border-slate-800 z-50 animate-scale-in"
            >
              <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h4 class="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {{ t.t('notifications') }}
                </h4>
                <button
                  type="button"
                  class="text-xs text-teal-600 dark:text-teal-400 font-medium hover:underline"
                >
                  {{ t.t('markAllRead') }}
                </button>
              </div>

              <div class="mt-3 space-y-2.5 max-h-72 overflow-y-auto">
                <div
                  class="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                >
                  <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                    🩺
                  </span>
                  <div class="flex-1 min-w-0">
                    <p class="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      New Patient Scheduled: Sarah Jenkins
                    </p>
                    <p class="text-[11px] text-slate-400">Today at 10:30 AM · Cardiology</p>
                  </div>
                  <span class="h-2 w-2 rounded-full bg-teal-500 shrink-0 mt-1"></span>
                </div>

                <div
                  class="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                >
                  <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    📋
                  </span>
                  <div class="flex-1 min-w-0">
                    <p class="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Lab Results Ready: Robert Davis
                    </p>
                    <p class="text-[11px] text-slate-400">45 minutes ago · Blood Lipid Panel</p>
                  </div>
                  <span class="h-2 w-2 rounded-full bg-amber-500 shrink-0 mt-1"></span>
                </div>

                <div
                  class="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                >
                  <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    🔒
                  </span>
                  <div class="flex-1 min-w-0">
                    <p class="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Security alert: Login from Chrome on Windows
                    </p>
                    <p class="text-[11px] text-slate-400">2 hours ago · IP 192.168.1.104</p>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>

        <!-- User Profile Avatar & Dropdown -->
        <div class="relative">
          <button
            type="button"
            (click)="toggleProfileMenu()"
            class="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-start"
          >
            <div class="relative">
              <img
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=120&auto=format&fit=crop&q=80"
                alt="Doctor Avatar"
                class="w-8.5 h-8.5 rounded-xl object-cover ring-2 ring-teal-500/40"
              />
              <span
                class="absolute -bottom-0.5 -end-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900"
              ></span>
            </div>
            <div class="hidden md:block">
              <p class="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                Dr. Ahmed Ebrahim
              </p>
              <p class="text-[10px] text-teal-600 dark:text-teal-400 font-medium leading-tight">
                Chief Medical Officer
              </p>
            </div>
            <svg class="hidden md:block w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- User Menu Dropdown -->
          @if (isProfileMenuOpen()) {
            <div
              class="absolute end-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 p-2 shadow-2xl border border-slate-200/80 dark:border-slate-800 z-50 animate-scale-in"
            >
              <div class="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                <p class="text-xs font-bold text-slate-900 dark:text-slate-100">Dr. Ahmed Ebrahim</p>
                <p class="text-[11px] text-slate-400 truncate">doctor.ahmed&#64;medicore.com</p>
              </div>

              <a
                routerLink="/profile"
                (click)="isProfileMenuOpen.set(false)"
                class="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/70 rounded-xl transition-colors"
              >
                <svg class="w-4 h-4 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {{ t.t('viewProfile') }}
              </a>

              <a
                routerLink="/profile"
                (click)="isProfileMenuOpen.set(false)"
                class="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/70 rounded-xl transition-colors"
              >
                <svg class="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {{ t.t('accountSettings') }}
              </a>

              <div class="my-1 border-t border-slate-100 dark:border-slate-800"></div>

              <button
                type="button"
                (click)="isProfileMenuOpen.set(false)"
                class="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {{ t.t('logout') }}
              </button>
            </div>
          }
        </div>
      </div>
    </header>
  `,
})
export class NavbarComponent {
  @Output() sidebarToggle = new EventEmitter<void>();

  protected readonly theme = inject(ThemeService);
  protected readonly t = inject(TranslationService);

  readonly isNotificationsOpen = signal(false);
  readonly isProfileMenuOpen = signal(false);

  toggleNotifications(): void {
    this.isNotificationsOpen.update((v) => !v);
    if (this.isNotificationsOpen()) {
      this.isProfileMenuOpen.set(false);
    }
  }

  toggleProfileMenu(): void {
    this.isProfileMenuOpen.update((v) => !v);
    if (this.isProfileMenuOpen()) {
      this.isNotificationsOpen.set(false);
    }
  }

  onGlobalSearch(query: string): void {
    // Can emit or wire with table/global search
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('header')) {
      this.isNotificationsOpen.set(false);
      this.isProfileMenuOpen.set(false);
    }
  }
}
