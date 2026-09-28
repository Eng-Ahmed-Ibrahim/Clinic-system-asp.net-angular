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
import { PatientService } from '../../core/services/patient.service';
import { ToastService } from '../../core/services/toast.service';
import { Patient, PatientStatus } from '../../core/models/patient.model';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-patients-page',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchInputComponent, ModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2.5">
            <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {{ t.t('navPatients') }}
            </h2>
            <span
              class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300"
            >
              {{ patientService.totalCount() }} {{ t.t('results') }}
            </span>
          </div>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {{ t.t('tableSubtitle') }}
          </p>
        </div>

        <button
          type="button"
          (click)="openAddModal()"
          class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold shadow-md shadow-teal-600/20 transition-all self-start sm:self-auto transform active:scale-95"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
          </svg>
          {{ t.t('newPatient') }}
        </button>
      </div>

      <!-- Filter Controls Card -->
      <div
        class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <!-- Search Input -->
        <div class="w-full md:w-80">
          <app-search-input
            [value]="searchTerm()"
            (valueChange)="searchTerm.set($event)"
            [placeholder]="t.t('quickSearchTable')"
            [showShortcutBadge]="true"
          ></app-search-input>
        </div>

        <!-- Status Filter Pills -->
        <div class="flex flex-wrap items-center gap-1.5">
          @for (tab of statusTabs; track tab.value) {
            <button
              type="button"
              (click)="selectedStatus.set(tab.value)"
              class="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
              [ngClass]="
                selectedStatus() === tab.value
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-700/70'
              "
            >
              {{ t.t(tab.labelKey) }}
            </button>
          }
        </div>
      </div>

      <!-- Data Table Card -->
      <div
        class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden"
      >
        <!-- Bulk Selection Alert Bar -->
        @if (selectedIds().size > 0) {
          <div
            class="px-5 py-2.5 bg-teal-50 dark:bg-teal-950/70 border-b border-teal-200 dark:border-teal-800 flex items-center justify-between text-xs"
          >
            <div class="flex items-center gap-2 text-teal-800 dark:text-teal-200 font-semibold">
              <span>✓ {{ selectedIds().size }} {{ t.t('selectedCount') }}</span>
            </div>
            <button
              type="button"
              (click)="deleteSelectedPrompt()"
              class="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold transition-colors"
            >
              {{ t.t('deleteRecord') }} ({{ selectedIds().size }})
            </button>
          </div>
        }

        <!-- Table View -->
        <div class="overflow-x-auto">
          <table class="w-full text-start text-xs sm:text-sm">
            <thead class="bg-slate-50/80 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <!-- Selection Checkbox -->
                <th scope="col" class="py-3.5 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    [checked]="isAllSelected()"
                    (change)="toggleSelectAll()"
                    class="rounded border-slate-300 dark:border-slate-700 text-teal-600 focus:ring-teal-500 cursor-pointer"
                  />
                </th>

                <!-- Patient (Sortable) -->
                <th
                  scope="col"
                  (click)="toggleSort('name')"
                  class="py-3.5 px-4 text-start cursor-pointer select-none hover:text-slate-900 dark:hover:text-white"
                >
                  <div class="flex items-center gap-1.5">
                    <span>{{ t.t('patientName') }}</span>
                    <span class="text-[10px] text-slate-400">{{ getSortIcon('name') }}</span>
                  </div>
                </th>

                <th scope="col" class="py-3.5 px-4 text-start">{{ t.t('ageGender') }}</th>

                <!-- Diagnosis (Sortable) -->
                <th
                  scope="col"
                  (click)="toggleSort('diagnosis')"
                  class="py-3.5 px-4 text-start cursor-pointer select-none hover:text-slate-900 dark:hover:text-white"
                >
                  <div class="flex items-center gap-1.5">
                    <span>{{ t.t('diagnosis') }}</span>
                    <span class="text-[10px] text-slate-400">{{ getSortIcon('diagnosis') }}</span>
                  </div>
                </th>

                <!-- Last Visit (Sortable) -->
                <th
                  scope="col"
                  (click)="toggleSort('lastVisit')"
                  class="py-3.5 px-4 text-start cursor-pointer select-none hover:text-slate-900 dark:hover:text-white"
                >
                  <div class="flex items-center gap-1.5">
                    <span>{{ t.t('lastVisitDate') }}</span>
                    <span class="text-[10px] text-slate-400">{{ getSortIcon('lastVisit') }}</span>
                  </div>
                </th>

                <!-- Status (Sortable) -->
                <th
                  scope="col"
                  (click)="toggleSort('status')"
                  class="py-3.5 px-4 text-start cursor-pointer select-none hover:text-slate-900 dark:hover:text-white"
                >
                  <div class="flex items-center gap-1.5">
                    <span>{{ t.t('status') }}</span>
                    <span class="text-[10px] text-slate-400">{{ getSortIcon('status') }}</span>
                  </div>
                </th>

                <th scope="col" class="py-3.5 px-4 text-end">{{ t.t('actions') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
              @for (p of paginatedPatients(); track p.id) {
                <tr
                  class="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  [ngClass]="{ 'bg-teal-50/40 dark:bg-teal-950/20': selectedIds().has(p.id) }"
                >
                  <!-- Checkbox -->
                  <td class="py-3.5 px-4 text-center">
                    <input
                      type="checkbox"
                      [checked]="selectedIds().has(p.id)"
                      (change)="toggleSelectRow(p.id)"
                      class="rounded border-slate-300 dark:border-slate-700 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                  </td>

                  <!-- Patient Name & Info -->
                  <td class="py-3.5 px-4">
                    <div class="flex items-center gap-3">
                      <img
                        [src]="p.avatar"
                        [alt]="p.name"
                        class="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                      />
                      <div>
                        <span class="font-bold text-slate-900 dark:text-slate-100 block">
                          {{ p.name }}
                        </span>
                        <span class="text-xs text-slate-400">{{ p.id }} · {{ p.email }}</span>
                      </div>
                    </div>
                  </td>

                  <!-- Age / Gender -->
                  <td class="py-3.5 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    {{ p.age }} yrs · {{ p.gender }}
                    <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 ms-1">
                      {{ p.bloodType }}
                    </span>
                  </td>

                  <!-- Diagnosis -->
                  <td class="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                    {{ p.diagnosis }}
                    <span class="block text-[11px] text-slate-400">{{ p.doctor }}</span>
                  </td>

                  <!-- Last Visit -->
                  <td class="py-3.5 px-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {{ p.lastVisit }}
                  </td>

                  <!-- Status -->
                  <td class="py-3.5 px-4 whitespace-nowrap">
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
                  <td class="py-3.5 px-4 text-end whitespace-nowrap">
                    <div class="flex items-center justify-end gap-1">
                      <!-- View -->
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

                      <!-- Edit -->
                      <button
                        type="button"
                        (click)="openEditModal(p)"
                        class="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        [title]="t.t('editRecord')"
                      >
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>

                      <!-- Delete -->
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
                  <td colspan="7" class="py-12 text-center text-sm text-slate-400">
                    {{ t.t('noRecordsFound') }}
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Pagination Bar -->
        <div
          class="p-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400"
        >
          <!-- Showing count -->
          <div>
            {{ t.t('showingResults') }}
            <span class="font-bold text-slate-800 dark:text-slate-200">{{ paginationRange().start }}</span>
            -
            <span class="font-bold text-slate-800 dark:text-slate-200">{{ paginationRange().end }}</span>
            {{ t.t('ofResults') }}
            <span class="font-bold text-slate-800 dark:text-slate-200">{{ sortedPatients().length }}</span>
            {{ t.t('results') }}
          </div>

          <!-- Page buttons & Page Size -->
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-1.5">
              <span>{{ t.t('rowsPerPage') }}:</span>
              <select
                [(ngModel)]="pageSize"
                (change)="currentPage.set(1)"
                class="rounded-lg bg-slate-100 dark:bg-slate-800 border-none py-1 px-2 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                <option [ngValue]="5">5</option>
                <option [ngValue]="10">10</option>
                <option [ngValue]="20">20</option>
              </select>
            </div>

            <div class="flex items-center gap-1">
              <button
                type="button"
                (click)="prevPage()"
                [disabled]="currentPage() === 1"
                class="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {{ t.t('previous') }}
              </button>

              @for (page of totalPagesArray(); track page) {
                <button
                  type="button"
                  (click)="currentPage.set(page)"
                  class="w-7 h-7 rounded-lg text-xs font-bold transition-colors"
                  [ngClass]="
                    currentPage() === page
                      ? 'bg-teal-600 text-white'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                  "
                >
                  {{ page }}
                </button>
              }

              <button
                type="button"
                (click)="nextPage()"
                [disabled]="currentPage() >= totalPages()"
                class="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {{ t.t('next') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Patient Modal -->
    <app-modal
      [isOpen]="isFormModalOpen()"
      [title]="isEditing() ? t.t('editPatientTitle') : t.t('addPatientTitle')"
      [subtitle]="isEditing() ? t.t('editPatientSubtitle') : t.t('addPatientSubtitle')"
      size="lg"
      (closed)="isFormModalOpen.set(false)"
    >
      <form (ngSubmit)="savePatientForm()" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Full Name -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {{ t.t('fullName') }} *
            </label>
            <input
              type="text"
              name="formName"
              [(ngModel)]="patientForm.name"
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
              name="formEmail"
              [(ngModel)]="patientForm.email"
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
              name="formPhone"
              [(ngModel)]="patientForm.phone"
              class="w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 py-2.5 px-3.5 text-sm text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-teal-500 focus:outline-hidden"
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
                name="formAge"
                [(ngModel)]="patientForm.age"
                class="w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 py-2.5 px-3.5 text-sm text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-teal-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {{ t.t('gender') }}
              </label>
              <select
                name="formGender"
                [(ngModel)]="patientForm.gender"
                class="w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 py-2.5 px-3.5 text-sm text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-teal-500 focus:outline-hidden"
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
              name="formDiagnosis"
              [(ngModel)]="patientForm.diagnosis"
              required
              class="w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 py-2.5 px-3.5 text-sm text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-teal-500 focus:outline-hidden"
            />
          </div>

          <!-- Status & Blood Type -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {{ t.t('status') }}
            </label>
            <select
              name="formStatus"
              [(ngModel)]="patientForm.status"
              class="w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 py-2.5 px-3.5 text-sm text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-teal-500 focus:outline-hidden"
            >
              <option value="Active">Active</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {{ t.t('bloodGroup') }}
            </label>
            <select
              name="formBlood"
              [(ngModel)]="patientForm.bloodType"
              class="w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 py-2.5 px-3.5 text-sm text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-teal-500 focus:outline-hidden"
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

        <div modal-footer class="flex items-center gap-2">
          <button
            type="button"
            (click)="isFormModalOpen.set(false)"
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

    <!-- View Modal -->
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
          (click)="confirmDelete()"
          class="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-all"
        >
          {{ t.t('confirmDelete') }}
        </button>
      </div>
    </app-modal>
  `,
})
export class PatientsPageComponent {
  protected readonly t = inject(TranslationService);
  protected readonly patientService = inject(PatientService);
  private readonly toast = inject(ToastService);

  readonly searchTerm = signal('');
  readonly selectedStatus = signal<string>('All');
  readonly sortColumn = signal<'name' | 'diagnosis' | 'lastVisit' | 'status'>('name');
  readonly sortDirection = signal<'asc' | 'desc'>('asc');
  readonly selectedIds = signal<Set<string>>(new Set());

  readonly currentPage = signal(1);
  pageSize = 5;

  readonly isFormModalOpen = signal(false);
  readonly isViewModalOpen = signal(false);
  readonly isDeleteModalOpen = signal(false);
  readonly isEditing = signal(false);
  readonly editingId = signal<string | null>(null);

  readonly selectedPatient = signal<Patient | null>(null);
  readonly itemToDelete = signal<string | null>(null);

  readonly statusTabs = [
    { value: 'All', labelKey: 'statusAll' },
    { value: 'Active', labelKey: 'statusActive' },
    { value: 'Scheduled', labelKey: 'statusScheduled' },
    { value: 'Completed', labelKey: 'statusCompleted' },
    { value: 'Cancelled', labelKey: 'statusCancelled' },
  ];

  readonly patientForm = {
    name: '',
    email: '',
    phone: '',
    age: 35,
    gender: 'Male' as 'Male' | 'Female',
    diagnosis: '',
    status: 'Active' as PatientStatus,
    bloodType: 'O+',
  };

  readonly filteredPatients = computed(() => {
    const query = this.searchTerm().toLowerCase().trim();
    const status = this.selectedStatus();
    let list = this.patientService.patients();

    if (status !== 'All') {
      list = list.filter((p) => p.status === status);
    }

    if (query) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.diagnosis.toLowerCase().includes(query) ||
          p.id.toLowerCase().includes(query) ||
          p.email.toLowerCase().includes(query)
      );
    }

    return list;
  });

  readonly sortedPatients = computed(() => {
    const list = [...this.filteredPatients()];
    const col = this.sortColumn();
    const dir = this.sortDirection();

    return list.sort((a, b) => {
      const valA = (a[col] ?? '').toString().toLowerCase();
      const valB = (b[col] ?? '').toString().toLowerCase();
      const cmp = valA.localeCompare(valB);
      return dir === 'asc' ? cmp : -cmp;
    });
  });

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.sortedPatients().length / this.pageSize))
  );

  readonly totalPagesArray = computed(() => {
    const total = this.totalPages();
    return Array.from({ length: total }, (_, i) => i + 1);
  });

  readonly paginatedPatients = computed(() => {
    const page = this.currentPage();
    const start = (page - 1) * this.pageSize;
    return this.sortedPatients().slice(start, start + this.pageSize);
  });

  readonly paginationRange = computed(() => {
    const total = this.sortedPatients().length;
    if (total === 0) return { start: 0, end: 0 };
    const start = (this.currentPage() - 1) * this.pageSize + 1;
    const end = Math.min(start + this.pageSize - 1, total);
    return { start, end };
  });

  readonly isAllSelected = computed(() => {
    const current = this.paginatedPatients();
    if (current.length === 0) return false;
    const sel = this.selectedIds();
    return current.every((p) => sel.has(p.id));
  });

  toggleSort(col: 'name' | 'diagnosis' | 'lastVisit' | 'status'): void {
    if (this.sortColumn() === col) {
      this.sortDirection.update((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortColumn.set(col);
      this.sortDirection.set('asc');
    }
  }

  getSortIcon(col: string): string {
    if (this.sortColumn() !== col) return '⇅';
    return this.sortDirection() === 'asc' ? '▲' : '▼';
  }

  toggleSelectAll(): void {
    const current = this.paginatedPatients();
    const sel = new Set(this.selectedIds());

    if (this.isAllSelected()) {
      current.forEach((p) => sel.delete(p.id));
    } else {
      current.forEach((p) => sel.add(p.id));
    }
    this.selectedIds.set(sel);
  }

  toggleSelectRow(id: string): void {
    const sel = new Set(this.selectedIds());
    if (sel.has(id)) {
      sel.delete(id);
    } else {
      sel.add(id);
    }
    this.selectedIds.set(sel);
  }

  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((p) => p - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((p) => p + 1);
    }
  }

  openAddModal(): void {
    this.isEditing.set(false);
    this.editingId.set(null);
    this.patientForm.name = '';
    this.patientForm.email = '';
    this.patientForm.phone = '';
    this.patientForm.diagnosis = '';
    this.patientForm.status = 'Active';
    this.isFormModalOpen.set(true);
  }

  openEditModal(p: Patient): void {
    this.isEditing.set(true);
    this.editingId.set(p.id);
    this.patientForm.name = p.name;
    this.patientForm.email = p.email;
    this.patientForm.phone = p.phone;
    this.patientForm.age = p.age;
    this.patientForm.gender = p.gender;
    this.patientForm.diagnosis = p.diagnosis;
    this.patientForm.status = p.status;
    this.patientForm.bloodType = p.bloodType;
    this.isFormModalOpen.set(true);
  }

  savePatientForm(): void {
    if (!this.patientForm.name || !this.patientForm.email || !this.patientForm.diagnosis) {
      this.toast.error(this.t.t('fillRequiredFields'));
      return;
    }

    if (this.isEditing() && this.editingId()) {
      this.patientService.updatePatient(this.editingId()!, {
        name: this.patientForm.name,
        email: this.patientForm.email,
        phone: this.patientForm.phone,
        age: this.patientForm.age,
        gender: this.patientForm.gender,
        diagnosis: this.patientForm.diagnosis,
        status: this.patientForm.status,
        bloodType: this.patientForm.bloodType,
      });
      this.toast.success(
        this.t.isRtl() ? 'تم تحديث بيانات المريض بنجاح' : 'Patient record updated successfully'
      );
    } else {
      this.patientService.addPatient({
        name: this.patientForm.name,
        email: this.patientForm.email,
        phone: this.patientForm.phone || '+1 (555) 000-0000',
        age: this.patientForm.age || 30,
        gender: this.patientForm.gender,
        bloodType: this.patientForm.bloodType,
        diagnosis: this.patientForm.diagnosis,
        doctor: 'Dr. Ahmed Ebrahim',
        lastVisit: new Date().toISOString().split('T')[0],
        status: this.patientForm.status,
        avatar: `https://images.unsplash.com/photo-${this.patientForm.gender === 'Female' ? '1494790108377-be9c29b29330' : '1507003211169-0a1dd7228f2d'}?w=120&auto=format&fit=crop&q=80`,
        amount: 200,
      });
      this.toast.success(
        this.t.isRtl() ? 'تمت إضافة المريض بنجاح' : 'New patient registered successfully'
      );
    }

    this.isFormModalOpen.set(false);
  }

  viewPatient(p: Patient): void {
    this.selectedPatient.set(p);
    this.isViewModalOpen.set(true);
  }

  deletePatientPrompt(p: Patient): void {
    this.itemToDelete.set(p.id);
    this.isDeleteModalOpen.set(true);
  }

  deleteSelectedPrompt(): void {
    this.itemToDelete.set('BULK');
    this.isDeleteModalOpen.set(true);
  }

  confirmDelete(): void {
    const item = this.itemToDelete();
    if (item === 'BULK') {
      const ids = Array.from(this.selectedIds());
      ids.forEach((id) => this.patientService.deletePatient(id));
      this.selectedIds.set(new Set());
      this.toast.info(
        this.t.isRtl()
          ? `تم حذف ${ids.length} سجلات بنجاح`
          : `Successfully deleted ${ids.length} records`
      );
    } else if (item) {
      this.patientService.deletePatient(item);
      const sel = new Set(this.selectedIds());
      sel.delete(item);
      this.selectedIds.set(sel);
      this.toast.info(this.t.isRtl() ? 'تم حذف السجل' : 'Record deleted');
    }
    this.isDeleteModalOpen.set(false);
    this.itemToDelete.set(null);
  }
}
