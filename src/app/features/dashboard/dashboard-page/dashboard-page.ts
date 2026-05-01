import { Component , computed, signal, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { TaskService } from '../../../core/services/task.service';
import { GoalService } from '../../../core/services/goal.service';
import { LogService } from '../../../core/services/log.service';
import { NzSkeletonModule }  from 'ng-zorro-antd/skeleton';  
import { NzSpinModule }      from 'ng-zorro-antd/spin'; 
@Component({
  selector: 'app-dashboard-page',
  imports: [
    CommonModule,
    RouterLink,
    NzCardModule,
    NzStatisticModule,
    NzListModule,
    NzGridModule,
    NzTagModule,
    NzIconModule,
    NzProgressModule,
    NzSkeletonModule, 
    NzSpinModule,
  ],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
})
export class DashboardPage {

  private taskService = inject(TaskService);
  private goalService = inject(GoalService);
  private logService = inject(LogService);

  loading = signal(true);

  
  // KPIs
  openTasks = this.taskService.openCount;
  highPriority = this.taskService.highPriorityOpen;
  activeGoals = computed(() => this.goalService.goals().filter(g => !g.completed).length);
  daysLogged = computed(() => this.logService.entries().length);

  // Recent items (top 5 each)
  recentTasks = computed(() =>
    [...this.taskService.tasks()]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 5)
  );

  topGoals = computed(() =>
    [...this.goalService.goals()]
      .filter(g => !g.completed)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4)
  );

   constructor() {
    setTimeout(() => this.loading.set(false), 600);
  }
}
