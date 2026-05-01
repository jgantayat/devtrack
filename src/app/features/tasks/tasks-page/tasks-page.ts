import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSpinModule }       from 'ng-zorro-antd/spin';          
import { NzPipesModule }      from 'ng-zorro-antd/pipes';         
import { NzNotificationService } from 'ng-zorro-antd/notification'; 
import { TaskService } from '../../../core/services/task.service';
import { Task, TaskPriority, TaskStatus } from '../../../core/models/task.model';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { TaskForm } from '../task-form-modal/task-form/task-form'
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import {NzCardModule} from 'ng-zorro-antd/card';
import { NzOptionComponent } from 'ng-zorro-antd/select';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
@Component({
  selector: 'app-tasks-page',
  imports: [
    CommonModule,
    NzTableModule,
    NzTagModule,
    NzButtonModule,
    NzIconModule,
    NzEmptyModule,
    NzDividerModule,
    NzModalModule,
    NzPopconfirmModule,
    ReactiveFormsModule,
    FormsModule,
    NzInputModule,
    NzCardModule,
    NzOptionComponent,
    NzFormModule,
    NzSelectModule,
    NzSpinModule,
    NzPipesModule
  ],
  templateUrl: './tasks-page.html',
  styleUrl: './tasks-page.css',
})
export class TasksPage {
  private taskService = inject(TaskService);
  private modal = inject(NzModalService);
  private message = inject(NzMessageService);
  private notification   = inject(NzNotificationService); 
  loading = signal(true);
  searchQuery = signal('');
  statusFilter = signal<TaskStatus[]>([]);
  priorityFilter = signal<TaskPriority[]>([]);
  categoryFilter = signal<string[]>([]);

  filteredTasks = computed(() => {
  const q = this.searchQuery().toLowerCase().trim();
  const statuses = this.statusFilter();
  const priorities = this.priorityFilter();
  const categories = this.categoryFilter();

  
  return this.taskService.tasks().filter(t => {
    if (q && !t.title.toLowerCase().includes(q) &&
              !t.description?.toLowerCase().includes(q)) return false;
    if (statuses.length && !statuses.includes(t.status)) return false;
    if (priorities.length && !priorities.includes(t.priority)) return false;
    if (categories.length && !categories.includes(t.category)) return false;
    return true;
  });
});

allCategories = computed(() =>
  Array.from(new Set(this.taskService.tasks().map(t => t.category)))
);
  
  constructor() {
  // if (this.taskService.tasks().length === 0) {
  //   this.taskService.add({ title: 'Read NG-ZORRO docs', description: 'Cover all Day 1 components',
  //     status: 'done', priority: 'medium', category: 'Learning' });
  //   this.taskService.add({ title: 'Build DevTrack layout',
  //     status: 'in-progress', priority: 'high', category: 'Project' });
  //   this.taskService.add({ title: 'Set up Spring Boot backend',
  //     status: 'todo', priority: 'low', category: 'Backend', dueDate: '2026-05-15' });
  // }
    setTimeout(() => this.loading.set(false), 600);
}

  sortByTitle = (a: Task, b: Task) => a.title.localeCompare(b.title);
  sortByDueDate = (a: Task, b: Task) => (a.dueDate ?? '').localeCompare(b.dueDate ?? '');

  statusColor(status: TaskStatus): string {
    return { 'todo': 'default', 'in-progress': 'processing', 'done': 'success' }[status];
  }

  priorityColor(priority: TaskPriority): string {
    return { 'low': 'blue', 'medium': 'orange', 'high': 'red' }[priority];
  }

  onAdd() {
  const ref = this.modal.create<TaskForm>({
    nzTitle: 'New Task',
    nzContent: TaskForm,
    nzWidth: 600,
    nzOkText: 'Create',
    nzCancelText: 'Cancel',
    nzOnOk: () => {
      const value = ref.getContentComponent().getValue();
      if (!value) return false;        // keeps modal open if invalid
      this.taskService.add(value as any);
      return true;
    }
  });
  }

 onEdit(task: Task) {
  const ref = this.modal.create({
    nzTitle: 'Edit Task',
    nzContent: TaskForm,
    nzData: { initialTask: task },     // passes data to component @Input
    nzWidth: 600,
    nzOkText: 'Save',
    nzOnOk: () => {
      const value = ref.getContentComponent().getValue();
      if (!value) return false;
      this.taskService.update(task.id, value as any);
      this.message.success('Task updated');
      return true;
    }
  });
}

onDelete(task: Task) {
  // The popconfirm in the template calls this on confirm
  this.taskService.delete(task.id);
  this.message.success(`"${task.title}" deleted`);
}

clearFilters() {
  this.searchQuery.set('');
  this.statusFilter.set([]);
  this.priorityFilter.set([]);
  this.categoryFilter.set([]);
}

onMarkDone(task: Task) {
    this.taskService.update(task.id, { status: 'done' });
    this.notification.create(
      'success',
      'Task completed!',
      `"${task.title}" was marked as done.`,
      { nzDuration: 4000 }
    );
  }
  titleSortFn = (a: Task, b: Task) => a.title.localeCompare(b.title);

}