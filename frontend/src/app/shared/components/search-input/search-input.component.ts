import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  HostListener,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative w-full group">
      <!-- Search Icon -->
      <div
        class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5 text-slate-400 group-focus-within:text-teal-600 dark:group-focus-within:text-teal-400 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <!-- Input Field -->
      <input
        #inputRef
        type="text"
        [value]="value"
        (input)="onInput($event)"
        [placeholder]="placeholder"
        [disabled]="disabled"
        class="w-full rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 py-2.5 ps-10 pe-16 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:border-teal-500 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      />

      <!-- End Actions: Clear Button & Keyboard Badge -->
      <div class="absolute inset-y-0 end-0 flex items-center pe-3 gap-1.5">
        @if (value) {
          <button
            type="button"
            (click)="clear()"
            class="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors"
            title="Clear search"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        }

        @if (showShortcutBadge) {
          <kbd
            class="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md shadow-2xs"
          >
            Ctrl K
          </kbd>
        }
      </div>
    </div>
  `,
})
export class SearchInputComponent {
  @Input() value = '';
  @Input() placeholder = 'Search...';
  @Input() disabled = false;
  @Input() showShortcutBadge = true;

  @Output() valueChange = new EventEmitter<string>();
  @Output() search = new EventEmitter<string>();

  @ViewChild('inputRef') inputElement?: ElementRef<HTMLInputElement>;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardShortcut(event: KeyboardEvent): void {
    if (this.showShortcutBadge && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.inputElement?.nativeElement.focus();
      this.inputElement?.nativeElement.select();
    }
  }

  onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value = val;
    this.valueChange.emit(val);
    this.search.emit(val);
  }

  clear(): void {
    this.value = '';
    this.valueChange.emit('');
    this.search.emit('');
    this.inputElement?.nativeElement.focus();
  }
}
