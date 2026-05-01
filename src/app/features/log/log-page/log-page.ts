import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { LogService } from '../../../core/services/log.service';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';         // NEW
import { NzDrawerService } from 'ng-zorro-antd/drawer'; 
import { LogEntryDrawer } from '../log-entry-drawer/log-entry-drawer/log-entry-drawer'; // NEW

@Component({
  selector: 'app-log-page',
  imports: [
    CommonModule,
    FormsModule,
    NzCalendarModule,
    NzCardModule,
    NzTagModule,
    NzIconModule,
    NzDrawerModule
  ],
  templateUrl: './log-page.html',
  styleUrl: './log-page.css',
})
export class LogPage {
  private logService = inject(LogService);
  private drawer     = inject(NzDrawerService);
  selectedDate: Date = new Date();

  entryFor(date: Date) {
    const ymd = date.toISOString().split('T')[0];
    return this.logService.entries().find(e => e.date === ymd);
  }

  onDateSelect(date: Date) {
    const ymd = date.toISOString().split('T')[0];

    // Collect every unique tag from every log entry for autocomplete suggestions
    const allTags = Array.from(
      new Set(this.logService.entries().flatMap(e => e.tags))
    );

    this.drawer.create({
      nzTitle:   'Log Entry',
      nzWidth:   480,
      nzContent: LogEntryDrawer,
      nzData:    { date: ymd, allTags }
    });
  }
}
