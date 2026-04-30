import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Goal } from '../models/goal.model.js';
import { StorageService } from './storage.service.js';

const KEY = 'devtrack:goals';

@Injectable({
  providedIn: 'root',
})
export class GoalService {

  private storage = inject(StorageService);

  private _goals = signal<Goal[]>(this.storage.read<Goal[]>(KEY, []));

  readonly goals = this._goals.asReadonly();

  readonly activeCount = computed(() =>
    this._goals().filter(g => !g.completed).length
  );

  readonly completedCount = computed(() =>
    this._goals().filter(g => g.completed).length
  );

  readonly avgProgress = computed(() => {
    const list = this._goals();
    if (!list.length) return 0;
    return Math.round(list.reduce((sum, g) => sum + g.progress, 0) / list.length);
  });

  readonly avgRating = computed(() => {
    const list = this._goals();
    if (!list.length) return 0;
    return +(list.reduce((sum, g) => sum + g.rating, 0) / list.length).toFixed(1);
  });

  constructor() {
    effect(() => {
      this.storage.write(KEY, this._goals());
    });
  }

  add(goal: Omit<Goal, 'id' | 'createdAt'>): Goal {
    const newGoal: Goal = {
      ...goal,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    this._goals.update(list => [newGoal, ...list]);
    return newGoal;
  }

  update(id: string, patch: Partial<Goal>): void {
    this._goals.update(list =>
      list.map(g => g.id === id ? { ...g, ...patch } : g)
    );
  }

  delete(id: string): void {
    this._goals.update(list => list.filter(g => g.id !== id));
  }

  getById(id: string): Goal | undefined {
    return this._goals().find(g => g.id === id);
  }

}
