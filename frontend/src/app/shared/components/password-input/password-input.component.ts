import {
  Component,
  Input,
  Output,
  EventEmitter,
  computed,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PasswordStrength } from '../../../core/models/user-profile.model';

@Component({
  selector: 'app-password-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full">
      <!-- Input Container -->
      <div class="relative group">
        <input
          [type]="showPassword() ? 'text' : 'password'"
          [value]="value"
          (input)="onInput($event)"
          [placeholder]="placeholder"
          [disabled]="disabled"
          class="w-full rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 py-2.5 ps-3.5 pe-11 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:border-teal-500 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 transition-all duration-200 disabled:opacity-50"
        />

        <!-- Show/Hide Button -->
        <button
          type="button"
          (click)="toggleShowPassword()"
          class="absolute inset-y-0 end-0 flex items-center pe-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-hidden"
          [attr.aria-label]="showPassword() ? 'Hide password' : 'Show password'"
        >
          @if (showPassword()) {
            <!-- Eye Off -->
            <svg class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
              />
            </svg>
          } @else {
            <!-- Eye -->
            <svg class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          }
        </button>
      </div>

      <!-- Optional Password Strength Indicator -->
      @if (showStrengthMeter && value) {
        <div class="mt-2.5 space-y-2">
          <!-- Strength Bar -->
          <div class="flex items-center gap-1.5">
            <div class="h-1.5 flex-1 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex gap-1">
              <div
                class="h-full transition-all duration-300 rounded-full"
                [ngClass]="{
                  'w-1/4 bg-rose-500': strength().score === 1,
                  'w-2/4 bg-amber-500': strength().score === 2,
                  'w-3/4 bg-blue-500': strength().score === 3,
                  'w-full bg-emerald-500': strength().score === 4,
                  'w-0': strength().score === 0
                }"
              ></div>
            </div>
            <span
              class="text-xs font-semibold px-2 py-0.5 rounded-full"
              [ngClass]="{
                'text-rose-600 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-400': strength().score <= 1,
                'text-amber-600 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-400': strength().score === 2,
                'text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400': strength().score === 3,
                'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400': strength().score === 4
              }"
            >
              {{ strength().label }}
            </span>
          </div>

          <!-- Rules Checklist -->
          @if (showRules) {
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1 text-xs">
              <div
                class="flex items-center gap-1.5"
                [ngClass]="strength().hasMinLength ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'"
              >
                <span class="text-sm">{{ strength().hasMinLength ? '✓' : '○' }}</span>
                <span>8+ characters</span>
              </div>
              <div
                class="flex items-center gap-1.5"
                [ngClass]="strength().hasUpperCase ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'"
              >
                <span class="text-sm">{{ strength().hasUpperCase ? '✓' : '○' }}</span>
                <span>Uppercase letter (A-Z)</span>
              </div>
              <div
                class="flex items-center gap-1.5"
                [ngClass]="strength().hasNumber ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'"
              >
                <span class="text-sm">{{ strength().hasNumber ? '✓' : '○' }}</span>
                <span>At least one number</span>
              </div>
              <div
                class="flex items-center gap-1.5"
                [ngClass]="strength().hasSpecialChar ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'"
              >
                <span class="text-sm">{{ strength().hasSpecialChar ? '✓' : '○' }}</span>
                <span>Special character (!@#$)</span>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class PasswordInputComponent {
  @Input() value = '';
  @Input() placeholder = 'Password';
  @Input() disabled = false;
  @Input() showStrengthMeter = false;
  @Input() showRules = false;

  @Output() valueChange = new EventEmitter<string>();

  readonly showPassword = signal(false);

  readonly strength = computed<PasswordStrength>(() => {
    const val = this.value || '';
    const hasMinLength = val.length >= 8;
    const hasUpperCase = /[A-Z]/.test(val);
    const hasLowerCase = /[a-z]/.test(val);
    const hasNumber = /[0-9]/.test(val);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(val);

    let score = 0;
    if (hasMinLength) score++;
    if (hasUpperCase && hasLowerCase) score++;
    if (hasNumber) score++;
    if (hasSpecialChar) score++;

    let label: PasswordStrength['label'] = 'Weak';
    let color = 'rose';

    if (score >= 4) {
      label = 'Strong';
      color = 'emerald';
    } else if (score === 3) {
      label = 'Good';
      color = 'blue';
    } else if (score === 2) {
      label = 'Fair';
      color = 'amber';
    }

    return {
      score,
      label,
      color,
      hasMinLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar,
    };
  });

  toggleShowPassword(): void {
    this.showPassword.update((val) => !val);
  }

  onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value = val;
    this.valueChange.emit(val);
  }
}
