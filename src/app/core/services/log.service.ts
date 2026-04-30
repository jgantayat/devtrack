import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { LogEntry } from '../models/log-entry.model.js';
import { StorageService } from './storage.service.js';

const KEY = 'devtrack:log';


@Injectable({
  providedIn: 'root',
})
export class LogService {

  private storage = inject(StorageService);

  private _entries = signal<LogEntry[]>(this.storage.read<LogEntry[]>(KEY, []));

  readonly entries = this._entries.asReadonly();

  readonly totalDays = computed(() => this._entries().length);

  readonly allTags = computed(() =>
    Array.from(new Set(this._entries().flatMap(e => e.tags)))
  );

  readonly avgMood = computed(() => {
    const list = this._entries();
    if (!list.length) return 0;
    return +(list.reduce((sum, e) => sum + e.mood, 0) / list.length).toFixed(1);
  });

  constructor() {
    effect(() => {
      this.storage.write(KEY, this._entries());
    });
  }

  // Handles both add and edit — keyed on date (one entry per day)
  upsert(data: Pick<LogEntry, 'date' | 'content' | 'tags' | 'mood'>): LogEntry {
    const existing = this._entries().find(e => e.date === data.date);

    if (existing) {
      const updated = { ...existing, ...data };
      this._entries.update(list =>
        list.map(e => e.date === data.date ? updated : e)
      );
      return updated;
    }

    const newEntry: LogEntry = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    this._entries.update(list => [newEntry, ...list]);
    return newEntry;
  }

  delete(id: string): void {
    this._entries.update(list => list.filter(e => e.id !== id));
  }

  getByDate(date: string): LogEntry | undefined {
    return this._entries().find(e => e.date === date);
  }

  getById(id: string): LogEntry | undefined {
    return this._entries().find(e => e.id === id);
  }

}
