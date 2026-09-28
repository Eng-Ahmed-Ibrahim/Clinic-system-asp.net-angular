import {
  Component,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslationService } from '../../core/services/translation.service';
import { PatientService } from '../../core/services/patient.service';
import { ToastService } from '../../core/services/toast.service';
import { Patient, PatientStatus } from '../../core/models/patient.model';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SearchInputComponent, ModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <!-- Welcome Header Banner -->
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-700 text-white shadow-xl shadow-teal-900/10"
      >
        <div>
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-xs">
              {{ t.isRtl() ? 'عيادة اليوم' : "Today's Clinical Shift" }}
            </span>
            <span class="text-xs text-teal-100">
              {{ todayFormatted() }}
            </span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
            {{ t.isRtl() ? 'مرحباً بك مجدداً، د. أحمد إبراهيم' : 'Welcome back, Dr. Ahmed Ebrahim' }}
          </h2>
          <p class="text-sm text-teal-100/90 mt-1 max-w-xl">
            {{ t.isRtl() ? 'لديك 42 موعداً مجدولاً اليوم. تم تسجيل 5 مرضى جدد في العناية النشطة.' : 'You have 42 appointments scheduled today. 5 new patient registrations require clinical review.' }}
          </p>
        </div>

        <!-- Quick Action Trigger in Banner -->
        <div class="flex items-center gap-2.5">
          <button
            type="button"
            (click)="openAddModal()"
            class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-teal-800 text-sm font-bold shadow-md hover:bg-teal-50 transition-all transform active:scale-95"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
            </svg>
            {{ t.t('newPatient') }}
          </button>
          <button
            type="button"
            (click)="exportReport()"
            class="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-sm font-semibold backdrop-blur-xs transition-colors"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            {{ t.t('exportReport') }}
          </button>
        </div>
      </div>

      <!-- KPI Stat Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <!-- Card 1: Total Patients -->
        <div
          class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {{ t.t('totalPatients') }}
            </span>
            <div class="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-2xl font-extrabold text-slate-900 dark:text-white">2,845</span>
            <span class="flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              +14.2% ↑
            </span>
          </div>
          <p class="text-xs text-slate-400 mt-1">{{ t.t('totalPatientsDesc') }}</p>
        </div>

        <!-- Card 2: Appointments Today -->
        <div
          class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {{ t.t('appointmentsToday') }}
            </span>
            <div class="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-2xl font-extrabold text-slate-900 dark:text-white">42</span>
            <span class="text-xs font-semibold text-blue-600 dark:text-blue-400">
              8 {{ t.isRtl() ? 'مكتمل' : 'completed' }}
            </span>
          </div>
          <p class="text-xs text-slate-400 mt-1">{{ t.t('appointmentsTodayDesc') }}</p>
        </div>

        <!-- Card 3: Revenue -->
        <div
          class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {{ t.t('consultationsRevenue') }}
            </span>
            <div class="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-2xl font-extrabold text-slate-900 dark:text-white">$38,500</span>
            <span class="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              +8.5% ↑
            </span>
          </div>
          <p class="text-xs text-slate-400 mt-1">{{ t.t('consultationsRevenueDesc') }}</p>
        </div>

        <!-- Card 4: Satisfaction -->
        <div
          class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {{ t.t('doctorSatisfaction') }}
            </span>
            <div class="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </div>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-2xl font-extrabold text-slate-900 dark:text-white">98.4%</span>
            <span class="text-xs font-semibold text-amber-500">★★★★★</span>
          </div>
          <p class="text-xs text-slate-400 mt-1">{{ t.t('doctorSatisfactionDesc') }}</p>
        </div>
      </div>

      <!-- Weekly Analytics & Clinical Load Visuals -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Weekly Appointment Load (2 Cols) -->
        <div
          class="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs"
        >
          <div class="flex items-center justify-between mb-5">
            <div>
              <h3 class="text-base font-bold text-slate-900 dark:text-slate-100">
                {{ t.isRtl() ? 'نشاط المواعيد الأسبوعي' : 'Weekly Appointment Volume' }}
              </h3>
              <p class="text-xs text-slate-400">
                {{ t.isRtl() ? 'مقارنة بين الاستشارات الحضورية والافتراضية' : 'Comparison between In-Clinic vs Telehealth Visits' }}
              </p>
            </div>
            <span class="text-xs font-semibold px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300">
              {{ t.isRtl() ? 'هذا الأسبوع' : 'Current Week' }}
            </span>
          </div>

          <!-- Custom CSS Chart Bars -->
          <div class="flex items-end justify-between gap-3 sm:gap-6 h-48 pt-6 pb-2 border-b border-slate-100 dark:border-slate-800">
            @for (bar of weeklyData; track bar.day) {
              <div class="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span class="text-[11px] font-bold text-slate-500 dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {{ bar.count }}
                </span>
                <div class="w-full max-w-[32px] rounded-t-lg bg-teal-100 dark:bg-slate-800 h-full flex flex-col justify-end overflow-hidden">
                  <div
                    class="w-full bg-gradient-to-t from-teal-600 to-emerald-400 rounded-t-lg transition-all duration-500 group-hover:brightness-110"
                    [style.height.%]="bar.percentage"
                  ></div>
                </div>
                <span class="text-xs font-medium text-slate-600 dark:text-slate-400">{{ bar.day }}</span>
              </div>
            }
          </div>

          <div class="mt-4 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
            <div class="flex items-center gap-4">
              <span class="flex items-center gap-1.5">
                <span class="h-2.5 w-2.5 rounded-full bg-teal-600"></span>
                {{ t.isRtl() ? 'كشف حضوري' : 'In-Person (68%)' }}
              </span>
              <span class="flex items-center gap-1.5">
                <span class="h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
                {{ t.isRtl() ? 'استشارة عن بعد' : 'Telehealth (32%)' }}
              </span>
            </div>
            <span class="font-medium text-slate-700 dark:text-slate-300">
              {{ t.isRtl() ? 'المتوسط: 38 مريض/يوم' : 'Daily Average: 38 patients' }}
            </span>
          </div>
        </div>

        <!-- Department Breakdown (1 Col) -->
        <div
          class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between"
        >
          <div>
            <h3 class="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
              {{ t.isRtl() ? 'توزيع الأقسام الطبية' : 'Department Distribution' }}
            </h3>
            <p class="text-xs text-slate-400 mb-5">
              {{ t.isRtl() ? 'نسبة الاستشارات حسب التخصص' : 'Consultations by clinical specialty' }}
            </p>

            <div class="space-y-4">
              <div>
                <div class="flex justify-between text-xs font-semibold mb-1">
                  <span class="text-slate-700 dark:text-slate-300">{{ t.isRtl() ? 'أمراض القلب' : 'Cardiology' }}</span>
                  <span class="text-teal-600 dark:text-teal-400">42%</span>
                </div>
                <div class="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div class="h-full bg-teal-500 rounded-full w-[42%]"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-xs font-semibold mb-1">
                  <span class="text-slate-700 dark:text-slate-300">{{ t.isRtl() ? 'الباطنة العامة' : 'Internal Medicine' }}</span>
                  <span class="text-blue-600 dark:text-blue-400">28%</span>
                </div>
                <div class="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div class="h-full bg-blue-500 rounded-full w-[28%]"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-xs font-semibold mb-1">
                  <span class="text-slate-700 dark:text-slate-300">{{ t.isRtl() ? 'طب الأطفال' : 'Pediatrics' }}</span>
                  <span class="text-indigo-600 dark:text-indigo-400">18%</span>
                </div>
                <div class="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div class="h-full bg-indigo-500 rounded-full w-[18%]"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-xs font-semibold mb-1">
                  <span class="text-slate-700 dark:text-slate-300">{{ t.isRtl() ? 'المخ والأعصاب' : 'Neurology' }}</span>
                  <span class="text-amber-500">12%</span>
                </div>
                <div class="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div class="h-full bg-amber-500 rounded-full w-[12%]"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
            <a
              routerLink="/patients"
              class="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/40 rounded-xl transition-colors"
            >
              {{ t.isRtl() ? 'عرض كل السجلات الطبية ←' : 'View Full Registry →' }}
            </a>
          </div>
        </div>
      </div>

      <!-- Recent Patients & Consultations Table Component -->
      <div
        class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden"
      >
        <!-- Table Header & Filter Bar -->
        <div class="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 class="text-base font-bold text-slate-900 dark:text-slate-100">
              {{ t.t('tableTitle') }}
            </h3>
            <p class="text-xs text-slate-400 mt-0.5">
              {{ t.t('tableSubtitle') }}
            </p>
          </div>

          <!-- Search & Filter Controls -->
          <div class="flex items-center gap-3">
            <div class="w-64">
              <app-search-input
                [placeholder]="t.t('quickSearchTable')"
                [showShortcutBadge]="false"
                (search)="tableSearch.set($event)"
              ></app-search-input>
            </div>
            <button
              type="button"
              (click)="openAddModal()"
              class="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
              </svg>
              {{ t.t('newPatient') }}
            </button>
          </div>
        </div>

        <!-- Table Responsive Container -->
        <div class="overflow-x-auto">
          <table class="w-full text-start text-xs sm:text-sm">
            <thead class="bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th scope="col" class="py-3 px-4 text-start">{{ t.t('patientName') }}</th>
                <th scope="col" class="py-3 px-4 text-start">{{ t.t('ageGender') }}</th>
                <th scope="col" class="py-3 px-4 text-start">{{ t.t('diagnosis') }}</th>
                <th scope="col" class="py-3 px-4 text-start">{{ t.t('lastVisitDate') }}</th>
                <th scope="col" class="py-3 px-4 text-start">{{ t.t('status') }}</th>
                <th scope="col" class="py-3 px-4 text-end">{{ t.t('actions') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
              @for (p of filteredPatients(); track p.id) {
                <tr class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <!-- Patient Info -->
                  <td class="py-3 px-4">
                    <div class="flex items-center gap-3">
                      <img
                        [src]="p.avatar"
                        [alt]="p.name"
                        class="w-9 h-9 rounded-xl object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700"
                      />
                      <div>
                        <span class="font-bold text-slate-900 dark:text-slate-100 hover:text-teal-600 block">
                          {{ p.name }}
                        </span>
                        <span class="text-xs text-slate-400">{{ p.id }} · {{ p.email }}</span>
                      </div>
                    </div>
                  </td>

                  <!-- Age / Gender -->
                  <td class="py-3 px-4 text-slate-600 dark:text-slate-300">
                    {{ p.age }} yrs · {{ p.gender }}
                    <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 ms-1">
                      {{ p.bloodType }}
                    </span>
                  </td>

                  <!-- Diagnosis -->
                  <td class="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                    {{ p.diagnosis }}
                  </td>

                  <!-- Last Visit -->
                  <td class="py-3 px-4 text-slate-500 dark:text-slate-400">
                    {{ p.lastVisit }}
                  </td>

                  <!-- Status Badge -->
                  <td class="py-3 px-4">
                    <span
                      class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                      [ngClass]="{
                        'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800':
                          p.status === 'Active',
                        'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800':
                          p.status === 'Scheduled',
                        'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800':
                          p.status === 'Completed',
                        'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800':
                          p.status === 'Cancelled'
                      }"
                    >
                      <span
                        class="w-1.5 h-1.5 rounded-full"
                        [ngClass]="{
                          'bg-emerald-500': p.status === 'Active',
                          'bg-sky-500': p.status === 'Scheduled',
                          'bg-indigo-500': p.status === 'Completed',
                          'bg-rose-500': p.status === 'Cancelled'
                        }"
                      ></span>
                      {{ p.status }}
                    </span>
                  </td>

                  <!-- Actions -->
                  <td class="py-3 px-4 text-end">
                    <div class="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        (click)="viewPatient(p)"
                        class="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        [title]="t.t('viewDetails')"
                      >
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        (click)="deletePatientPrompt(p)"
                        class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        [title]="t.t('deleteRecord')"
                      >
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="py-8 text-center text-sm text-slate-400">
                    {{ t.t('noRecordsFound') }}
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add Patient Modal Popup -->
    <app-modal
      [isOpen]="isAddModalOpen()"
      [title]="t.t('addPatientTitle')"
      [subtitle]="t.t('addPatientSubtitle')"
      size="lg"
      (closed)="isAddModalOpen.set(false)"
    >
      <form (ngSubmit)="submitAddPatient()" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Full Name -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {{ t.t('fullName') }} *
            </label>
            <input
              type="text"
              name="newName"
              [(ngModel)]="newPatientForm.name"
              required
              [placeholder]="t.t('fullNamePlaceholder')"
              class="w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 py-2.5 px-3.5 text-sm text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-teal-500 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {{ t.t('emailAddress') }} *
            </label>
            <input
              type="email"
              name="newEmail"
              [(ngModel)]="newPatientForm.email"
              required
              [placeholder]="t.t('emailPlaceholder')"
              class="w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 py-2.5 px-3.5 text-sm text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-teal-500 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <!-- Phone -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {{ t.t('phoneNumber') }}
            </label>
            <input
              type="tel"
              name="newPhone"
              [(ngModel)]="newPatientForm.phone"
              [placeholder]="t.t('phonePlaceholder')"
              class="w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 py-2.5 px-3.5 text-sm text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-teal-500 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <!-- Age & Gender -->
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {{ t.t('age') }}
              </label>
              <input
                type="number"
                name="newAge"
                [(ngModel)]="newPatientForm.age"
                class="w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 py-2.5 px-3.5 text-sm text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-teal-500 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {{ t.t('gender') }}
              </label>
              <select
                name="newGender"
                [(ngModel)]="newPatientForm.gender"
                class="w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 py-2.5 px-3.5 text-sm text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-teal-500 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20"
              >
                <option value="Male">{{ t.t('male') }}</option>
                <option value="Female">{{ t.t('female') }}</option>
              </select>
            </div>
          </div>

          <!-- Primary Diagnosis -->
          <div class="sm:col-span-2">
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {{ t.t('diagnosis') }} *
            </label>
            <input
              type="text"
              name="newDiagnosis"
              [(ngModel)]="newPatientForm.diagnosis"
              required
              placeholder="e.g. Essential Hypertension Follow-up"
              class="w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 py-2.5 px-3.5 text-sm text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-teal-500 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <!-- Status -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {{ t.t('status') }}
            </label>
            <select
              name="newStatus"
              [(ngModel)]="newPatientForm.status"
              class="w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 py-2.5 px-3.5 text-sm text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-teal-500 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20"
            >
              <option value="Active">Active</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <!-- Blood Group -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {{ t.t('bloodGroup') }}
            </label>
            <select
              name="newBloodType"
              [(ngModel)]="newPatientForm.bloodType"
              class="w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 py-2.5 px-3.5 text-sm text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-teal-500 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20"
            >
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>
        </div>

        <!-- Footer Actions Slot -->
        <div modal-footer class="flex items-center gap-2">
          <button
            type="button"
            (click)="isAddModalOpen.set(false)"
            class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {{ t.t('cancel') }}
          </button>
          <button
            type="submit"
            class="px-5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-md transition-all"
          >
            {{ t.t('saveChanges') }}
          </button>
        </div>
      </form>
    </app-modal>

    <!-- View Patient Details Modal -->
    <app-modal
      [isOpen]="isViewModalOpen()"
      [title]="selectedPatient()?.name ?? ''"
      [subtitle]="selectedPatient()?.id ?? ''"
      size="md"
      (closed)="isViewModalOpen.set(false)"
    >
      @if (selectedPatient(); as patient) {
        <div class="space-y-4 text-xs sm:text-sm">
          <div class="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
            <img [src]="patient.avatar" [alt]="patient.name" class="w-14 h-14 rounded-2xl object-cover ring-2 ring-teal-500/30" />
            <div>
              <h4 class="font-bold text-base text-slate-900 dark:text-white">{{ patient.name }}</h4>
              <p class="text-xs text-slate-400">{{ patient.email }} · {{ patient.phone }}</p>
              <span class="inline-block mt-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300">
                {{ patient.status }}
              </span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3 text-slate-600 dark:text-slate-300">
            <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
              <span class="block text-[11px] text-slate-400 font-medium">{{ t.t('diagnosis') }}</span>
              <span class="font-semibold text-slate-900 dark:text-white">{{ patient.diagnosis }}</span>
            </div>
            <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
              <span class="block text-[11px] text-slate-400 font-medium">{{ t.t('doctorAssigned') }}</span>
              <span class="font-semibold text-slate-900 dark:text-white">{{ patient.doctor }}</span>
            </div>
            <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
              <span class="block text-[11px] text-slate-400 font-medium">{{ t.t('ageGender') }}</span>
              <span class="font-semibold text-slate-900 dark:text-white">{{ patient.age }} yrs · {{ patient.gender }} ({{ patient.bloodType }})</span>
            </div>
            <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
              <span class="block text-[11px] text-slate-400 font-medium">{{ t.t('lastVisitDate') }}</span>
              <span class="font-semibold text-slate-900 dark:text-white">{{ patient.lastVisit }}</span>
            </div>
          </div>
        </div>
      }

      <div modal-footer>
        <button
          type="button"
          (click)="isViewModalOpen.set(false)"
          class="px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
        >
          {{ t.t('close') }}
        </button>
      </div>
    </app-modal>

    <!-- Delete Confirmation Modal -->
    <app-modal
      [isOpen]="isDeleteModalOpen()"
      [title]="t.t('deletePatientTitle')"
      size="sm"
      (closed)="isDeleteModalOpen.set(false)"
    >
      <div class="text-sm text-slate-600 dark:text-slate-300">
        <p>{{ t.t('deletePatientMessage') }}</p>
        @if (patientToDelete(); as patient) {
          <div class="mt-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs font-semibold">
            {{ patient.name }} ({{ patient.id }})
          </div>
        }
      </div>

      <div modal-footer class="flex items-center gap-2">
        <button
          type="button"
          (click)="isDeleteModalOpen.set(false)"
          class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {{ t.t('cancel') }}
        </button>
        <button
          type="button"
          (click)="confirmDeletePatient()"
          class="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-all"
        >
          {{ t.t('confirmDelete') }}
        </button>
      </div>
    </app-modal>
  `,
})
export class DashboardOverviewComponent {
  protected readonly t = inject(TranslationService);
  protected readonly patientService = inject(PatientService);
  private readonly toast = inject(ToastService);

  readonly tableSearch = signal('');
  readonly isAddModalOpen = signal(false);
  readonly isViewModalOpen = signal(false);
  readonly isDeleteModalOpen = signal(false);

  readonly selectedPatient = signal<Patient | null>(null);
  readonly patientToDelete = signal<Patient | null>(null);

  readonly newPatientForm = {
    name: '',
    email: '',
    phone: '',
    age: 30,
    gender: 'Male' as 'Male' | 'Female',
    diagnosis: '',
    status: 'Active' as PatientStatus,
    bloodType: 'A+',
  };

  readonly weeklyData = [
    { day: 'Mon', count: 32, percentage: 65 },
    { day: 'Tue', count: 45, percentage: 90 },
    { day: 'Wed', count: 38, percentage: 76 },
    { day: 'Thu', count: 50, percentage: 100 },
    { day: 'Fri', count: 42, percentage: 84 },
    { day: 'Sat', count: 24, percentage: 48 },
    { day: 'Sun', count: 18, percentage: 36 },
  ];

  readonly filteredPatients = computed(() => {
    const query = this.tableSearch().toLowerCase().trim();
    const list = this.patientService.patients();
    if (!query) return list.slice(0, 5); // top 5 for dashboard

    return list.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.diagnosis.toLowerCase().includes(query) ||
        p.id.toLowerCase().includes(query) ||
        p.doctor.toLowerCase().includes(query)
    );
  });

  todayFormatted(): string {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  openAddModal(): void {
    this.newPatientForm.name = '';
    this.newPatientForm.email = '';
    this.newPatientForm.phone = '';
    this.newPatientForm.diagnosis = '';
    this.isAddModalOpen.set(true);
  }

  submitAddPatient(): void {
    if (!this.newPatientForm.name || !this.newPatientForm.email || !this.newPatientForm.diagnosis) {
      this.toast.error(this.t.t('fillRequiredFields'));
      return;
    }

    this.patientService.addPatient({
      name: this.newPatientForm.name,
      email: this.newPatientForm.email,
      phone: this.newPatientForm.phone || '+1 (555) 000-0000',
      age: this.newPatientForm.age || 30,
      gender: this.newPatientForm.gender,
      bloodType: this.newPatientForm.bloodType,
      diagnosis: this.newPatientForm.diagnosis,
      doctor: 'Dr. Ahmed Ebrahim',
      lastVisit: new Date().toISOString().split('T')[0],
      status: this.newPatientForm.status,
      avatar: `https://images.unsplash.com/photo-${this.newPatientForm.gender === 'Female' ? '1494790108377-be9c29b29330' : '1507003211169-0a1dd7228f2d'}?w=120&auto=format&fit=crop&q=80`,
      amount: 200,
    });

    this.toast.success(
      this.t.isRtl()
        ? `تم تسجيل المريض ${this.newPatientForm.name} بنجاح`
        : `Patient ${this.newPatientForm.name} registered successfully`
    );
    this.isAddModalOpen.set(false);
  }

  viewPatient(p: Patient): void {
    this.selectedPatient.set(p);
    this.isViewModalOpen.set(true);
  }

  deletePatientPrompt(p: Patient): void {
    this.patientToDelete.set(p);
    this.isDeleteModalOpen.set(true);
  }

  confirmDeletePatient(): void {
    const p = this.patientToDelete();
    if (p) {
      this.patientService.deletePatient(p.id);
      this.toast.info(
        this.t.isRtl()
          ? `تم حذف ملف المريض ${p.name}`
          : `Patient record for ${p.name} deleted`
      );
      this.patientToDelete.set(null);
    }
    this.isDeleteModalOpen.set(false);
  }

  exportReport(): void {
    this.toast.success(
      this.t.isRtl()
        ? 'تم تصدير التقرير الطبي بصيغة CSV بنجاح'
        : 'Clinical report exported successfully as CSV'
    );
  }
}
