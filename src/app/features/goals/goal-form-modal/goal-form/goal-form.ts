import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { Goal } from '../../../../core/models/goal.model';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSliderModule } from 'ng-zorro-antd/slider';

@Component({
  selector: 'app-goal-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzDatePickerModule,
    NzRateModule,
    NzSwitchModule,
    NzGridModule,
    NzSliderModule,   // NEW — Day 9
    NzRateModule,     // NEW — Day 9
    NzCheckboxModule  // NEW — Day 9
  ],
  templateUrl: './goal-form.html',
  styleUrl: './goal-form.css',
})
export class GoalForm implements OnInit {
  private fb = inject(FormBuilder);
  private modalRef = inject(NzModalRef);
  private nzData: { initialGoal?: Goal } = inject(NZ_MODAL_DATA);

    progressMarks = {
    0:   '0%',
    25:  '25%',
    50:  '50%',
    75:  '75%',
    100: { style: { color: '#52c41a' }, label: 'Done' }
  };
  
  form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: [''],
    category: ['', Validators.required],
    progress: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    rating: [0],
    deadline: [null as Date | null],
    completed: [false],
  });

  ngOnInit() {
    const goal = this.nzData?.initialGoal;
    if (goal) {
      this.form.patchValue({
        ...goal,
        deadline: goal.deadline ? new Date(goal.deadline) : null,
      });
    }
  }

  getValue() {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach(c => {
        c.markAsDirty();
        c.updateValueAndValidity({ onlySelf: true });
      });
      return null;
    }
    const v = this.form.getRawValue();
    return {
      ...v,
      deadline: v.deadline ? (v.deadline as Date).toISOString().split('T')[0] : undefined,
    };
  }
}
