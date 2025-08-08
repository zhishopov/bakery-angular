import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ErrorService {
  readonly message = signal<string | null>(null);
  setError(msg: string | null) {
    this.message.set(msg);
  }
  clear() {
    this.message.set(null);
  }
}
