import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDrawerRef, NZ_DRAWER_DATA } from 'ng-zorro-antd/drawer';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { LogService } from '../../../../../app/core/services/log.service';
interface DrawerData {
  date: string;       // "YYYY-MM-DD" — which day this drawer is editing
  allTags: string[];  // every tag ever used across all entries — for autocomplete
}

@Component({
  selector: 'app-log-entry-drawer',
  imports: [
    CommonModule,
    FormsModule,
    NzInputModule,
    NzAutocompleteModule,
    NzTagModule,
    NzButtonModule,
    NzRateModule,
    NzIconModule,
    NzDrawerModule
  ],
  templateUrl: './log-entry-drawer.html',
  styleUrl: './log-entry-drawer.css',
})
export class LogEntryDrawer implements OnInit {
  private drawerRef  = inject(NzDrawerRef);
  private logService = inject(LogService);
  data: DrawerData   = inject(NZ_DRAWER_DATA);

  // Local state — not reactive forms, just plain properties
  content  = '';
  mood     = 3;
  tags: string[] = [];
  tagInput = '';

  ngOnInit() {
    // If a log entry already exists for this date, pre-fill the fields
    const existing = this.logService.entries().find(e => e.date === this.data.date);
    if (existing) {
      this.content = existing.content;
      this.mood    = existing.mood;
      this.tags    = [...existing.tags]; // spread to avoid mutating the original array
    }
  }

  // Called on every keystroke in the tag input
  filteredTags(): string[] {
    if (!this.tagInput) return this.data.allTags;
    return this.data.allTags.filter(t =>
      t.toLowerCase().includes(this.tagInput.toLowerCase())
      && !this.tags.includes(t)  // don't suggest tags already added
    );
  }

  addTag() {
    const t = this.tagInput.trim();
    if (t && !this.tags.includes(t)) {
      this.tags.push(t);
    }
    this.tagInput = ''; // clear the input after adding
  }

  removeTag(tag: string) {
    this.tags = this.tags.filter(t => t !== tag);
  }

  save() {
    this.logService.upsert({
      date:    this.data.date,
      content: this.content,
      tags:    this.tags,
      mood:    this.mood
    });
    this.drawerRef.close('saved'); // the string 'saved' is the return value
  }

  cancel() {
    this.drawerRef.close(); // no return value = dismissed
  }

}
