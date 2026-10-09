import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isOpen) {
      <div class="fixed inset-0 z-50 overflow-y-auto">
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
          (click)="onBackdropClick()"
          aria-hidden="true"
        ></div>

        <!-- Center modal wrapper -->
        <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-6">
          <div
            class="relative w-full transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 text-start shadow-2xl transition-all duration-300 border border-slate-200/80 dark:border-slate-800 animate-scale-in"
            [ngClass]="{
              'max-w-sm': size === 'sm',
              'max-w-md': size === 'md',
              'max-w-xl': size === 'lg',
              'max-w-3xl': size === 'xl'
            }"
            role="dialog"
            aria-modal="true"
          >
            <!-- Modal Header -->
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 px-6 py-4.5">
              <div>
                <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {{ title }}
                </h3>
                @if (subtitle) {
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {{ subtitle }}
                  </p>
                }
              </div>

              <!-- Close button -->
              <button
                type="button"
                (click)="close()"
                class="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                aria-label="Close modal"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Modal Body -->
            <div class="px-6 py-5 max-h-[70vh] overflow-y-auto">
              <ng-content></ng-content>
            </div>

            <!-- Modal Footer -->
            <div
              class="flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 px-6 py-4"
            >
              <ng-content select="[modal-footer]"></ng-content>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      @keyframes scaleIn {
        from {
          opacity: 0;
          transform: scale(0.96) translateY(8px);
        }
        to {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }
      .animate-fade-in {
        animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      .animate-scale-in {
        animation: scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
    `,
  ],
}) 
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() subtitle = '';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() closeOnBackdrop = true;
  @Input() closeOnEscape = true;

  @Output() closed = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  handleEscape(): void {
    if (this.isOpen && this.closeOnEscape) {
      this.close();
    }
  }

  onBackdropClick(): void {
    if (this.closeOnBackdrop) {
      this.close();
    }
  }

  close(): void {
    this.closed.emit();
  }
}
