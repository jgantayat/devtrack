import { Component, inject, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Task } from '../../../../core/models/task.model';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-task-form',
  imports: [
    CommonModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzDatePickerModule,
    ReactiveFormsModule
  ],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css',
})
export class TaskForm implements OnInit {
   private fb = inject(FormBuilder);
  private modalRef = inject(NzModalRef);
  private nzData: { initialTask?: Task } = inject(NZ_MODAL_DATA);

  @Input() initialTask?: Task;

  form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: [''],
    status: ['todo' as Task['status'], Validators.required],
    priority: ['medium' as Task['priority'], Validators.required],
    category: ['', Validators.required],
    dueDate: [null as Date | null]
  });

  ngOnInit() {
    const task = this.nzData?.initialTask;
  if (task) {
    this.form.patchValue({
      ...task,
      dueDate: task.dueDate ? new Date(task.dueDate) : null
    });
  }
  }

  // Called by parent via modal config
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
      dueDate: v.dueDate ? v.dueDate.toISOString().split('T')[0] : undefined
    };
  }
}
