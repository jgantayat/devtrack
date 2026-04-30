import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Task } from '../models/task.model.js';
import { StorageService } from './storage.service.js';

const KEY = 'devtrack:tasks';

@Injectable({
  providedIn: 'root',
})
export class TaskService {

  private storage = inject(StorageService);

  // Source of truth
  private _tasks = signal<Task[]>(this.storage.read<Task[]>(KEY, []));

  // Public read-only
  readonly tasks = this._tasks.asReadonly();

  // Derived state — recomputes automatically when _tasks changes
  readonly openCount = computed(() =>
    this._tasks().filter(t => t.status !== 'done').length
  );

  readonly completedCount = computed(() =>
    this._tasks().filter(t => t.status === 'done').length
  );

  readonly highPriorityOpen = computed(() =>
    this._tasks().filter(t => t.priority === 'high' && t.status !== 'done').length
  );

  constructor() {
    // Auto-persist on every change
    effect(() => {
      this.storage.write(KEY, this._tasks());
    });
  }

  add(task: Omit<Task, 'id' | 'createdAt'>): Task {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    this._tasks.update(list => [newTask, ...list]);
    return newTask;
  }

  update(id: string, patch: Partial<Task>): void {
    this._tasks.update(list =>
      list.map(t => t.id === id
        ? { ...t, ...patch, completedAt: patch.status === 'done' ? new Date().toISOString() : t.completedAt }
        : t)
    );
  }

  delete(id: string): void {
    this._tasks.update(list => list.filter(t => t.id !== id));
  }

  getById(id: string): Task | undefined {
    return this._tasks().find(t => t.id === id);
  }

}
