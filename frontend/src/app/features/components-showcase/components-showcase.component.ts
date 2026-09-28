import {
  Component,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../core/services/translation.service';
import { ToastService } from '../../core/services/toast.service';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { PasswordInputComponent } from '../../shared/components/password-input/password-input.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-components-showcase',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchInputComponent, PasswordInputComponent, ModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-10 max-w-6xl mx-auto">
      <!-- Showcase Page Header -->
      <div>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {{ t.t('componentsTitle') }}
        </h2>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          {{ t.t('componentsSubtitle') }}
        </p>
      </div>

      <!-- SECTION 1: SEARCH INPUTS -->
      <section class="space-y-4">
        <div class="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-2">
          <span class="p-1.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
            🔍
          </span>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">
            {{ t.t('searchShowcaseTitle') }}
          </h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <!-- Standard Search with Shortcut -->
          <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <h4 class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Search with Shortcut & Clear Button
            </h4>
            <app-search-input
              [placeholder]="'Search records or press Ctrl+K...'"
              [showShortcutBadge]="true"
              (search)="onShowcaseSearch($event)"
            ></app-search-input>
            <p class="text-xs text-slate-400">
              Press <kbd class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono">Ctrl+K</kbd> from anywhere to focus.
            </p>
          </div>

          <!-- Compact Search Bar -->
          <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <h4 class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Compact Live Filter Search
            </h4>
            <app-search-input
              [placeholder]="'Quick filter query...'"
              [showShortcutBadge]="false"
              (search)="onShowcaseSearch($event)"
            ></app-search-input>
            <p class="text-xs text-slate-400">
              Ideal for in-table filtering and toolbar layouts.
            </p>
          </div>
        </div>
      </section>

      <!-- SECTION 2: FORM INPUTS & PASSWORD COMPONENT -->
      <section class="space-y-4">
        <div class="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-2">
          <span class="p-1.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
            ✍️
          </span>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">
            {{ t.t('inputsShowcaseTitle') }}
          </h3>
        </div>

        <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <!-- Standard Text Input -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Standard Text Input
              </label>
              <input
                type="text"
                placeholder="Enter patient name..."
                class="w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 py-2.5 px-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-teal-500 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20"
              />
              <span class="text-[11px] text-slate-400 mt-1 block">Helpful guidance text</span>
            </div>

            <!-- Email Input with Icon -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email Input with Leading Icon
              </label>
              <div class="relative">
                <span class="absolute inset-y-0 start-0 flex items-center ps-3 text-slate-400 pointer-events-none">
                  ✉
                </span>
                <input
                  type="email"
                  placeholder="doctor@hospital.org"
                  class="w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 py-2.5 ps-9 pe-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-teal-500 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
            </div>

            <!-- Dropdown Select -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Custom Dropdown Select
              </label>
              <select
                class="w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 py-2.5 px-3.5 text-sm text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-teal-500 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20"
              >
                <option>Cardiology Consultation</option>
                <option>Internal Medicine Check</option>
                <option>Pediatric Assessment</option>
                <option>Surgical Follow-up</option>
              </select>
            </div>

            <!-- Valid State -->
            <div>
              <label class="block text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1.5">
                Validated Input (Success State)
              </label>
              <div class="relative">
                <input
                  type="text"
                  value="valid.record@medicore.com"
                  readonly
                  class="w-full rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500 py-2.5 px-3.5 pe-9 text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden"
                />
                <span class="absolute inset-y-0 end-0 flex items-center pe-3 text-emerald-500">✓</span>
              </div>
              <span class="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 block">Valid record format</span>
            </div>

            <!-- Invalid State -->
            <div>
              <label class="block text-xs font-semibold text-rose-700 dark:text-rose-400 mb-1.5">
                Error State (Validation Feedback)
              </label>
              <div class="relative">
                <input
                  type="text"
                  value="invalid_record_id"
                  readonly
                  class="w-full rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-500 py-2.5 px-3.5 pe-9 text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden"
                />
                <span class="absolute inset-y-0 end-0 flex items-center pe-3 text-rose-500">✕</span>
              </div>
              <span class="text-[11px] text-rose-600 dark:text-rose-400 mt-1 block">Please enter a valid format</span>
            </div>

            <!-- Disabled State -->
            <div>
              <label class="block text-xs font-semibold text-slate-400 mb-1.5">
                Disabled Read-Only Input
              </label>
              <input
                type="text"
                value="EHR-SYSTEM-READONLY-TOKEN"
                disabled
                class="w-full rounded-xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 py-2.5 px-3.5 text-sm text-slate-400 opacity-60 cursor-not-allowed"
              />
            </div>
          </div>

          <!-- Password Component Demonstration with Real-Time Strength Meter -->
          <div class="pt-4 border-t border-slate-100 dark:border-slate-800">
            <h4 class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Password Input with Toggle & Live Strength Meter
            </h4>
            <div class="max-w-md">
              <app-password-input
                [value]="demoPassword()"
                (valueChange)="demoPassword.set($event)"
                placeholder="Try typing 'MediCore@2026'..."
                [showStrengthMeter]="true"
                [showRules]="true"
              ></app-password-input>
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION 3: MODAL POPUPS & DIALOGS -->
      <section class="space-y-4">
        <div class="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-2">
          <span class="p-1.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
            🪟
          </span>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">
            {{ t.t('modalsShowcaseTitle') }}
          </h3>
        </div>

        <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <p class="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Accessible dialog popups featuring smooth enter/exit animations, keyboard ESC listener, and backdrop click dismiss.
          </p>

          <div class="flex flex-wrap items-center gap-3">
            <!-- Modal Trigger 1: Informational -->
            <button
              type="button"
              (click)="isInfoModalOpen.set(true)"
              class="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm transition-all"
            >
              {{ t.t('openModalBtn') }} (Small)
            </button>

            <!-- Modal Trigger 2: Confirmation -->
            <button
              type="button"
              (click)="isConfirmModalOpen.set(true)"
              class="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition-all"
            >
              {{ t.t('openConfirmBtn') }} (Danger)
            </button>

            <!-- Modal Trigger 3: Large Form Dialog -->
            <button
              type="button"
              (click)="isFormModalOpen.set(true)"
              class="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-bold shadow-sm transition-all"
            >
              Interactive Form Dialog (Large)
            </button>
          </div>
        </div>
      </section>

      <!-- SECTION 4: MODERN DATA TABLE PREVIEW -->
      <section class="space-y-4">
        <div class="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-2">
          <span class="p-1.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
            📊
          </span>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">
            {{ t.t('tablesShowcaseTitle') }}
          </h3>
        </div>

        <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
          <div class="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span class="text-xs font-bold text-slate-800 dark:text-slate-200">
              Interactive Styled Table
            </span>
            <span class="text-xs text-teal-600 dark:text-teal-400 font-semibold">
              Responsive & Theme-Adaptive
            </span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-start text-xs sm:text-sm">
              <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold">
                <tr>
                  <th class="py-3 px-4 text-start">Module</th>
                  <th class="py-3 px-4 text-start">Version</th>
                  <th class="py-3 px-4 text-start">Status</th>
                  <th class="py-3 px-4 text-start">Compliance</th>
                  <th class="py-3 px-4 text-end">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td class="py-3 px-4 font-bold text-slate-900 dark:text-white">Patient Records EHR</td>
                  <td class="py-3 px-4 text-slate-400 font-mono">v4.2.1</td>
                  <td class="py-3 px-4">
                    <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                      Active
                    </span>
                  </td>
                  <td class="py-3 px-4 text-slate-600 dark:text-slate-300">HIPAA Compliant</td>
                  <td class="py-3 px-4 text-end">
                    <button class="px-2 py-1 rounded bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400 font-bold hover:underline">
                      Inspect
                    </button>
                  </td>
                </tr>
                <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td class="py-3 px-4 font-bold text-slate-900 dark:text-white">Telehealth Video Bridge</td>
                  <td class="py-3 px-4 text-slate-400 font-mono">v2.1.0</td>
                  <td class="py-3 px-4">
                    <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300">
                      Running
                    </span>
                  </td>
                  <td class="py-3 px-4 text-slate-600 dark:text-slate-300">End-to-End Encrypted</td>
                  <td class="py-3 px-4 text-end">
                    <button class="px-2 py-1 rounded bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400 font-bold hover:underline">
                      Inspect
                    </button>
                  </td>
                </tr>
                <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td class="py-3 px-4 font-bold text-slate-900 dark:text-white">Pharmacy Dispatch Service</td>
                  <td class="py-3 px-4 text-slate-400 font-mono">v1.8.4</td>
                  <td class="py-3 px-4">
                    <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                      Pending Sync
                    </span>
                  </td>
                  <td class="py-3 px-4 text-slate-600 dark:text-slate-300">FDA Verified</td>
                  <td class="py-3 px-4 text-end">
                    <button class="px-2 py-1 rounded bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400 font-bold hover:underline">
                      Inspect
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>

    <!-- Info Modal Instance -->
    <app-modal
      [isOpen]="isInfoModalOpen()"
      title="Clinic System Information"
      subtitle="MediCore EHR v2.4.0 Engine"
      size="sm"
      (closed)="isInfoModalOpen.set(false)"
    >
      <div class="text-xs text-slate-600 dark:text-slate-300 space-y-2">
        <p>This is a reusable accessible modal component designed with backdrop blur and responsive scaling.</p>
        <p>Supports light & dark themes seamlessly, keyboard escape dismiss, and customized footer actions.</p>
      </div>

      <div modal-footer>
        <button
          type="button"
          (click)="isInfoModalOpen.set(false)"
          class="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white"
        >
          Got it
        </button>
      </div>
    </app-modal>

    <!-- Confirm Modal Instance -->
    <app-modal
      [isOpen]="isConfirmModalOpen()"
      title="Are you absolutely sure?"
      subtitle="This action cannot be undone"
      size="sm"
      (closed)="isConfirmModalOpen.set(false)"
    >
      <div class="text-xs text-slate-600 dark:text-slate-300">
        Deleting this item will revoke associated clinical prescriptions and notify the triage team immediately.
      </div>

      <div modal-footer class="flex items-center gap-2">
        <button
          type="button"
          (click)="isConfirmModalOpen.set(false)"
          class="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400"
        >
          Cancel
        </button>
        <button
          type="button"
          (click)="confirmShowcaseAction()"
          class="px-4 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white"
        >
          Confirm Delete
        </button>
      </div>
    </app-modal>

    <!-- Form Modal Instance -->
    <app-modal
      [isOpen]="isFormModalOpen()"
      title="Add Clinical Appointment Note"
      subtitle="Attach note to patient electronic health record"
      size="lg"
      (closed)="isFormModalOpen.set(false)"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
          <input
            type="text"
            placeholder="e.g. Post-operative cardiology evaluation"
            class="w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 py-2 px-3 text-xs"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Clinical Observations</label>
          <textarea
            rows="4"
            placeholder="Document patient vitals, prescription dosage changes, and clinical recommendations..."
            class="w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 py-2 px-3 text-xs"
          ></textarea>
        </div>
      </div>

      <div modal-footer class="flex items-center gap-2">
        <button
          type="button"
          (click)="isFormModalOpen.set(false)"
          class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400"
        >
          Discard
        </button>
        <button
          type="button"
          (click)="saveShowcaseNote()"
          class="px-5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white"
        >
          Save Note
        </button>
      </div>
    </app-modal>
  `,
})
export class ComponentsShowcaseComponent {
  protected readonly t = inject(TranslationService);
  private readonly toast = inject(ToastService);

  readonly demoPassword = signal('MediCore@2026');
  readonly isInfoModalOpen = signal(false);
  readonly isConfirmModalOpen = signal(false);
  readonly isFormModalOpen = signal(false);

  onShowcaseSearch(term: string): void {
    if (term) {
      this.toast.info(`Search filter applied: "${term}"`);
    }
  }

  confirmShowcaseAction(): void {
    this.isConfirmModalOpen.set(false);
    this.toast.error('Item deleted in demonstration');
  }

  saveShowcaseNote(): void {
    this.isFormModalOpen.set(false);
    this.toast.success('Clinical note attached successfully');
  }
}
