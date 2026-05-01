import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { FormsModule } from '@angular/forms';
import { GoalService } from '../../../core/services/goal.service';
import { Goal } from '../../../core/models/goal.model';
import { GoalForm } from '../goal-form-modal/goal-form/goal-form';
import { NzBadgeModule } from 'ng-zorro-antd/badge';

@Component({
  selector: 'app-goals-page',
  imports: [
    CommonModule,
    FormsModule,
    NzCardModule,
    NzStatisticModule,
    NzEmptyModule,
    NzProgressModule,
    NzRateModule,
    NzIconModule,
    NzButtonModule,
    NzPopconfirmModule,
    NzModalModule,
    NzGridModule,
     NzBadgeModule 
  ],
  templateUrl: './goals-page.html',
  styleUrl: './goals-page.css',
})
export class GoalsPage {
  private goalService = inject(GoalService);
  private modal = inject(NzModalService);
  private message = inject(NzMessageService);

  goals = this.goalService.goals;
  activeCount = this.goalService.activeCount;
  completedCount = this.goalService.completedCount;
  avgProgress = this.goalService.avgProgress;
  avgRating = this.goalService.avgRating;

  onAdd() {
    const ref = this.modal.create<GoalForm>({
      nzTitle: 'New Goal',
      nzContent: GoalForm,
      nzWidth: 600,
      nzOkText: 'Create',
      nzCancelText: 'Cancel',
      nzOnOk: () => {
        const value = ref.getContentComponent().getValue();
        if (!value) return false;
        this.goalService.add(value as any);
        return true;
      },
    });
  }

  onEdit(goal: Goal) {
    const ref = this.modal.create<GoalForm>({
      nzTitle: 'Edit Goal',
      nzContent: GoalForm,
      nzData: { initialGoal: goal },
      nzWidth: 600,
      nzOkText: 'Save',
      nzOnOk: () => {
        const value = ref.getContentComponent().getValue();
        if (!value) return false;
        this.goalService.update(goal.id, value as any);
        this.message.success('Goal updated');
        return true;
      },
    });
  }

  onDelete(goal: Goal) {
    this.goalService.delete(goal.id);
    this.message.success(`"${goal.title}" deleted`);
  }
}
