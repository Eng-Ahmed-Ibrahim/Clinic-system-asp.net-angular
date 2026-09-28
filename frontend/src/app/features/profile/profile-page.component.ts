import {
  Component,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../core/services/translation.service';
import { ThemeService } from '../../core/services/theme.service';
import { ToastService } from '../../core/services/toast.service';
import { UserProfile, PasswordUpdateForm } from '../../core/models/user-profile.model';
import { PasswordInputComponent } from '../../shared/components/password-input/password-input.component';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule, PasswordInputComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 max-w-6xl mx-auto">
      <!-- Profile Hero Header Card -->
      <div
        class="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden"
      >
        <!-- Cover Art Banner -->
        <div class="h-36 sm:h-48 bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-600 relative">
          <div class="absolute inset-0 bg-black/10"></div>
          <div class="absolute bottom-3 end-4 flex items-center gap-2">
            <span class="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-md">
              {{ t.isRtl() ? 'طبيب استشاري معتمد' : 'Board Certified Specialist' }}
            </span>
          </div>
        </div>

        <!-- Avatar, Identity & Quick Stats -->
        <div class="px-6 pb-6 pt-0 relative">
          <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
            <!-- Avatar & Details -->
            <div class="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-start">
              <div class="relative group">
                <img
                  [src]="profile().avatar"
                  alt="Doctor Profile"
                  class="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-white dark:ring-slate-900 shadow-xl"
                />
                <button
                  type="button"
                  (click)="simulatePhotoUpload()"
                  class="absolute inset-0 flex items-center justify-center rounded-3xl bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Change photo"
                >
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>
                <span
                  class="absolute bottom-1 end-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900"
                  [title]="t.t('online')"
                ></span>
              </div>

              <div class="sm:mb-2">
                <div class="flex items-center justify-center sm:justify-start gap-2">
                  <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                    {{ profile().fullName }}
                  </h2>
                  <svg class="w-5 h-5 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <p class="text-xs sm:text-sm font-medium text-teal-600 dark:text-teal-400">
                  {{ profile().specialty }} · {{ profile().department }}
                </p>
                <p class="text-xs text-slate-400 mt-0.5">
                  {{ profile().hospital }} · {{ profile().location }}
                </p>
              </div>
            </div>

            <!-- Stats badges -->
            <div class="flex items-center justify-center gap-3 sm:gap-4 sm:mb-2">
              <div class="text-center px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span class="block text-base font-extrabold text-slate-900 dark:text-white">1,420</span>
                <span class="text-[10px] text-slate-400 font-semibold">{{ t.isRtl() ? 'كشف طبي' : 'Consultations' }}</span>
              </div>
              <div class="text-center px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span class="block text-base font-extrabold text-slate-900 dark:text-white">98.4%</span>
                <span class="text-[10px] text-slate-400 font-semibold">{{ t.isRtl() ? 'تقييم إيجابي' : 'Satisfaction' }}</span>
              </div>
              <div class="text-center px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span class="block text-base font-extrabold text-slate-900 dark:text-white">12 yrs</span>
                <span class="text-[10px] text-slate-400 font-semibold">{{ t.isRtl() ? 'سنوات خبرة' : 'Experience' }}</span>
              </div>
            </div>
          </div>

          <!-- Navigation Tabs -->
          <div class="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800">
            <button
              type="button"
              (click)="activeTab.set('info')"
              class="flex items-center gap-2 pb-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all"
              [ngClass]="
                activeTab() === 'info'
                  ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
              "
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {{ t.t('tabPersonalInfo') }}
            </button>

            <button
              type="button"
              (click)="activeTab.set('security')"
              class="flex items-center gap-2 pb-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all"
              [ngClass]="
                activeTab() === 'security'
                  ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
              "
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              {{ t.t('tabSecurity') }}
            </button>

            <button
              type="button"
              (click)="activeTab.set('preferences')"
              class="flex items-center gap-2 pb-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all"
              [ngClass]="
                activeTab() === 'preferences'
                  ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
              "
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {{ t.t('tabPreferences') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Tab 1: Personal & Clinical Information -->
      @if (activeTab() === 'info') {
        <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs p-6">
          <div class="mb-6">
            <h3 class="text-base font-bold text-slate-900 dark:text-white">
              {{ t.t('personalInfoTitle') }}
            </h3>
            <p class="text-xs text-slate-400 mt-1">
              {{ t.t('personalInfoSubtitle') }}
            </p>
          </div>

          <form (ngSubmit)="savePersonalInfo()" class="space-y-5">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <!-- Full Name -->
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {{ t.t('fullName') }} *
                </label>
                <input
                  type="text"
                  name="profFullName"
                  [(ngModel)]="profileForm.fullName"
                  required
                  class="w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 py-2.5 px-3.5 text-sm text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-teal-500 focus:outline-hidden"
                />
              </div>

              <!-- Email -->
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {{ t.t('emailAddress') }} *
                </label>
                <input
                  type="email"
                  name="profEmail"
                  [(ngModel)]="profileForm.email"
                  required
                  class="w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 py-2.5 px-3.5 text-sm text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-teal-500 focus:outline-hidden"
                />
              </div>

              <!-- Phone -->
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {{ t.t('phoneNumber') }}
                </label>
                <input
                  type="tel"
                  name="profPhone"
                  [(ngModel)]="profileForm.phone"
                  class="w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 py-2.5 px-3.5 text-sm text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-teal-500 focus:outline-hidden"
                />
              </div>

              <!-- Specialty -->
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {{ t.t('specialty') }}
                </label>
                <input
                  type="text"
                  name="profSpecialty"
                  [(ngModel)]="profileForm.specialty"
                  class="w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 py-2.5 px-3.5 text-sm text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-teal-500 focus:outline-hidden"
                />
              </div>

              <!-- Clinic / Hospital -->
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {{ t.t('hospitalClinic') }}
                </label>
                <input
                  type="text"
                  name="profHospital"
                  [(ngModel)]="profileForm.hospital"
                  class="w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 py-2.5 px-3.5 text-sm text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-teal-500 focus:outline-hidden"
                />
              </div>

              <!-- Location -->
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Location / City
                </label>
                <input
                  type="text"
                  name="profLocation"
                  [(ngModel)]="profileForm.location"
                  class="w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 py-2.5 px-3.5 text-sm text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-teal-500 focus:outline-hidden"
                />
              </div>

              <!-- Bio -->
              <div class="sm:col-span-2">
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {{ t.t('bio') }}
                </label>
                <textarea
                  rows="3"
                  name="profBio"
                  [(ngModel)]="profileForm.bio"
                  class="w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 py-2.5 px-3.5 text-sm text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-teal-500 focus:outline-hidden"
                ></textarea>
              </div>
            </div>

            <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="submit"
                [disabled]="isSavingInfo()"
                class="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all disabled:opacity-60"
              >
                @if (isSavingInfo()) {
                  <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                }
                {{ t.t('saveChanges') }}
              </button>
            </div>
          </form>
        </div>
      }

      <!-- Tab 2: Security & Password Update -->
      @if (activeTab() === 'security') {
        <div class="space-y-6">
          <!-- Password Update Card -->
          <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs p-6">
            <div class="mb-6">
              <h3 class="text-base font-bold text-slate-900 dark:text-white">
                {{ t.t('securityTitle') }}
              </h3>
              <p class="text-xs text-slate-400 mt-1">
                {{ t.t('securitySubtitle') }}
              </p>
            </div>

            <form (ngSubmit)="submitPasswordUpdate()" class="max-w-xl space-y-5">
              <!-- Current Password -->
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {{ t.t('currentPassword') }} *
                </label>
                <app-password-input
                  [value]="passwordForm.currentPassword"
                  (valueChange)="passwordForm.currentPassword = $event"
                  [placeholder]="t.t('currentPasswordPlaceholder')"
                ></app-password-input>
              </div>

              <!-- New Password (with Strength Meter & Rules) -->
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {{ t.t('newPassword') }} *
                </label>
                <app-password-input
                  [value]="passwordForm.newPassword"
                  (valueChange)="passwordForm.newPassword = $event"
                  [placeholder]="t.t('newPasswordPlaceholder')"
                  [showStrengthMeter]="true"
                  [showRules]="true"
                ></app-password-input>
              </div>

              <!-- Confirm Password -->
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {{ t.t('confirmPassword') }} *
                </label>
                <app-password-input
                  [value]="passwordForm.confirmPassword"
                  (valueChange)="passwordForm.confirmPassword = $event"
                  [placeholder]="t.t('confirmPasswordPlaceholder')"
                ></app-password-input>

                <!-- Passwords match feedback -->
                @if (passwordForm.confirmPassword) {
                  <div class="mt-2 text-xs font-semibold flex items-center gap-1.5">
                    @if (passwordsMatch()) {
                      <span class="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        ✓ {{ t.t('passwordMatch') }}
                      </span>
                    } @else {
                      <span class="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                        ✕ {{ t.t('passwordMismatch') }}
                      </span>
                    }
                  </div>
                }
              </div>

              <div class="pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="submit"
                  [disabled]="isUpdatingPassword()"
                  class="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all disabled:opacity-60"
                >
                  @if (isUpdatingPassword()) {
                    <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  }
                  {{ t.t('updatePasswordBtn') }}
                </button>
              </div>
            </form>
          </div>

          <!-- Two-Factor Authentication Card -->
          <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="max-w-xl">
              <div class="flex items-center gap-2.5">
                <span class="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </span>
                <h4 class="text-sm font-bold text-slate-900 dark:text-white">
                  {{ t.t('twoFactorTitle') }}
                </h4>
              </div>
              <p class="text-xs text-slate-400 mt-1 ps-9">
                {{ t.t('twoFactorDesc') }}
              </p>
            </div>

            <button
              type="button"
              (click)="toggle2FA()"
              class="px-4 py-2 rounded-xl text-xs font-bold transition-all self-start sm:self-auto"
              [ngClass]="
                is2FAEnabled()
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              "
            >
              {{ is2FAEnabled() ? t.t('twoFactorEnabled') : t.t('twoFactorDisabled') }}
            </button>
          </div>
        </div>
      }

      <!-- Tab 3: Preferences -->
      @if (activeTab() === 'preferences') {
        <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-6">
          <div>
            <h3 class="text-base font-bold text-slate-900 dark:text-white">
              {{ t.t('tabPreferences') }}
            </h3>
            <p class="text-xs text-slate-400 mt-1">
              Customize appearance, language direction, and notifications
            </p>
          </div>

          <div class="space-y-4 max-w-xl">
            <!-- Theme Preference -->
            <div class="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div>
                <p class="text-xs font-bold text-slate-900 dark:text-white">{{ t.isRtl() ? 'مظهر الواجهة (ثيم)' : 'Interface Theme' }}</p>
                <p class="text-[11px] text-slate-400">{{ theme.isDark() ? t.t('darkMode') : t.t('lightMode') }}</p>
              </div>
              <button
                type="button"
                (click)="theme.toggleTheme()"
                class="px-3 py-1.5 rounded-lg text-xs font-bold bg-teal-600 text-white"
              >
                {{ theme.isDark() ? t.t('lightMode') : t.t('darkMode') }}
              </button>
            </div>

            <!-- Direction Preference -->
            <div class="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div>
                <p class="text-xs font-bold text-slate-900 dark:text-white">{{ t.isRtl() ? 'اتجاه الصفحة واللغة' : 'Direction & Language' }}</p>
                <p class="text-[11px] text-slate-400">{{ t.isRtl() ? 'العربية (من اليمين لليسار RTL)' : 'English (Left-to-Right LTR)' }}</p>
              </div>
              <button
                type="button"
                (click)="t.toggleLanguage()"
                class="px-3 py-1.5 rounded-lg text-xs font-bold bg-teal-600 text-white"
              >
                {{ t.isRtl() ? 'Switch to LTR' : 'التبديل إلى RTL' }}
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class ProfilePageComponent {
  protected readonly t = inject(TranslationService);
  protected readonly theme = inject(ThemeService);
  private readonly toast = inject(ToastService);

  readonly activeTab = signal<'info' | 'security' | 'preferences'>('info');
  readonly isSavingInfo = signal(false);
  readonly isUpdatingPassword = signal(false);
  readonly is2FAEnabled = signal(true);

  readonly profile = signal<UserProfile>({
    id: 'DOC-001',
    fullName: 'Dr. Ahmed Ebrahim',
    email: 'doctor.ahmed@medicore.com',
    phone: '+20 100 234 5678',
    specialty: 'Chief Medical Officer & Consultant Cardiologist',
    department: 'Department of Cardiology & Vascular Medicine',
    hospital: 'MediCore Central Clinic',
    location: 'Cairo, Egypt',
    bio: 'Fellow of the European Society of Cardiology. Over 12 years of specialized practice in clinical cardiology, arrhythmia management, and digital clinical systems.',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&auto=format&fit=crop&q=80',
    status: 'Online',
    joinDate: '2022-04-10',
    consultationsCount: 1420,
    patientsCount: 890,
    rating: 4.95,
    experienceYears: 12,
  });

  readonly profileForm = {
    fullName: this.profile().fullName,
    email: this.profile().email,
    phone: this.profile().phone,
    specialty: this.profile().specialty,
    department: this.profile().department,
    hospital: this.profile().hospital,
    location: this.profile().location,
    bio: this.profile().bio,
  };

  readonly passwordForm: PasswordUpdateForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  readonly passwordsMatch = computed(() => {
    const np = this.passwordForm.newPassword;
    const cp = this.passwordForm.confirmPassword;
    return np.length > 0 && np === cp;
  });

  simulatePhotoUpload(): void {
    this.toast.info(
      this.t.isRtl() ? 'تم تحديث الصورة الشخصية' : 'Profile photo updated successfully'
    );
  }

  savePersonalInfo(): void {
    if (!this.profileForm.fullName || !this.profileForm.email) {
      this.toast.error(this.t.t('fillRequiredFields'));
      return;
    }

    this.isSavingInfo.set(true);
    setTimeout(() => {
      this.profile.update((p) => ({
        ...p,
        fullName: this.profileForm.fullName,
        email: this.profileForm.email,
        phone: this.profileForm.phone,
        specialty: this.profileForm.specialty,
        department: this.profileForm.department,
        hospital: this.profileForm.hospital,
        location: this.profileForm.location,
        bio: this.profileForm.bio,
      }));
      this.isSavingInfo.set(false);
      this.toast.success(this.t.t('saveProfileSuccess'));
    }, 600);
  }

  submitPasswordUpdate(): void {
    if (!this.passwordForm.currentPassword || !this.passwordForm.newPassword || !this.passwordForm.confirmPassword) {
      this.toast.error(this.t.t('fillRequiredFields'));
      return;
    }

    if (this.passwordForm.newPassword.length < 8) {
      this.toast.error(
        this.t.isRtl()
          ? 'يجب أن تتكون كلمة المرور من 8 خانات على الأقل'
          : 'Password must be at least 8 characters long'
      );
      return;
    }

    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.toast.error(this.t.t('passwordMismatch'));
      return;
    }

    this.isUpdatingPassword.set(true);
    setTimeout(() => {
      this.isUpdatingPassword.set(false);
      this.passwordForm.currentPassword = '';
      this.passwordForm.newPassword = '';
      this.passwordForm.confirmPassword = '';
      this.toast.success(this.t.t('updatePasswordSuccess'));
    }, 800);
  }

  toggle2FA(): void {
    this.is2FAEnabled.update((v) => !v);
    this.toast.info(
      this.is2FAEnabled()
        ? (this.t.isRtl() ? 'تم تفعيل التحقق بخطوتين بنجاح' : 'Two-Factor Authentication Enabled')
        : (this.t.isRtl() ? 'تم تعطيل التحقق بخطوتين' : 'Two-Factor Authentication Disabled')
    );
  }
}
