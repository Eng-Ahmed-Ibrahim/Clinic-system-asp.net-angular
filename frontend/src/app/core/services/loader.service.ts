import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private activeRequests = 0;

  isLoading = signal(false);

  show(): void {
    this.activeRequests++;
    this.isLoading.set(true);
  }

  hide(): void {
    this.activeRequests = Math.max(0, this.activeRequests - 1);
    this.isLoading.set(this.activeRequests > 0);
  }
}