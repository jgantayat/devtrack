import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { NzCardModule }        from 'ng-zorro-antd/card';
import { NzTabsModule }        from 'ng-zorro-antd/tabs';
import { NzFormModule }        from 'ng-zorro-antd/form';
import { NzInputModule }       from 'ng-zorro-antd/input';
import { NzButtonModule }      from 'ng-zorro-antd/button';
import { NzIconModule }        from 'ng-zorro-antd/icon';
import { NzUploadModule }      from 'ng-zorro-antd/upload';
import { NzRadioModule }       from 'ng-zorro-antd/radio';
import { NzSwitchModule }      from 'ng-zorro-antd/switch';
import { NzSegmentedModule }   from 'ng-zorro-antd/segmented';
import { NzPopconfirmModule }  from 'ng-zorro-antd/popconfirm';
import { NzMessageService }    from 'ng-zorro-antd/message';
import { NzUploadFile }        from 'ng-zorro-antd/upload';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { SettingsService }  from '../../../core/services/settings-service';
import { TaskService }      from '../../../core/services/task.service';
import { GoalService }      from '../../../core/services/goal.service';
import { LogService }       from '../../../core/services/log.service';
import { StorageService }   from '../../../core/services/storage.service';

@Component({
  selector: 'app-settings-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzCardModule,
    NzTabsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzUploadModule,
    NzRadioModule,
    NzSwitchModule,
    NzSegmentedModule,
    NzPopconfirmModule,
    NzDividerModule
  ],
  templateUrl: './settings-page.html',
  styleUrl: './settings-page.css',
})
export class SettingsPage implements OnInit {

  private fb              = inject(FormBuilder);
  private settingsService = inject(SettingsService);
  private taskService     = inject(TaskService);
  private goalService     = inject(GoalService);
  private logService      = inject(LogService);
  private storageService  = inject(StorageService);
  private message         = inject(NzMessageService);

  // Signal that holds the preview URL for the avatar image
  avatarUrl = signal<string>('');

  // ── Three separate forms, one per tab ──────────────────────────

  profileForm = this.fb.nonNullable.group({
    displayName: ['']
  });

  appearanceForm = this.fb.nonNullable.group({
    theme:            ['light'],
    sidebarCollapsed: [false]
  });

  defaultsForm = this.fb.nonNullable.group({
    defaultPriority:      ['medium'],
    notificationsEnabled: [true]
  });

  // ── Lifecycle ──────────────────────────────────────────────────

  ngOnInit(): void {
    // Seed all three forms from the persisted settings
    const s = this.settingsService.settings();

    this.profileForm.patchValue({
      displayName: s.displayName
    });

    this.appearanceForm.patchValue({
      theme:            s.theme,
      sidebarCollapsed: s.sidebarCollapsed
    });

    this.defaultsForm.patchValue({
      defaultPriority:      s.defaultPriority,
      notificationsEnabled: s.notificationsEnabled
    });

    // Restore avatar preview if one was saved
    this.avatarUrl.set(s.avatarUrl);
  }

  // ── Save handlers — one per tab's Save button ──────────────────

  saveProfile(): void {
    const { displayName } = this.profileForm.getRawValue();
    this.settingsService.patch({ displayName, avatarUrl: this.avatarUrl() });
    this.message.success('Profile saved');
  }

  saveAppearance(): void {
    const { theme, sidebarCollapsed } = this.appearanceForm.getRawValue();
    this.settingsService.patch({
      theme:            theme as 'light' | 'dark' | 'compact',
      sidebarCollapsed: sidebarCollapsed
    });
    this.message.success('Appearance saved');
  }

  saveDefaults(): void {
    const { defaultPriority, notificationsEnabled } = this.defaultsForm.getRawValue();
    this.settingsService.patch({
      defaultPriority:      defaultPriority as 'low' | 'medium' | 'high',
      notificationsEnabled: notificationsEnabled
    });
    this.message.success('Defaults saved');
  }

  // ── Avatar upload — client-side preview only ───────────────────

  // nzBeforeUpload must return false to prevent actual HTTP upload.
  // We read the file as a data URL and store it in the signal instead.
  onAvatarSelect = (file: NzUploadFile): boolean => {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.avatarUrl.set(e.target?.result as string);
    };
    reader.readAsDataURL(file as unknown as File);
    return false; // returning false stops NG-ZORRO from attempting an HTTP upload
  };

  // ── Data tab actions ───────────────────────────────────────────

  exportData(): void {
    const payload = {
      tasks:    this.taskService.tasks(),
      goals:    this.goalService.goals(),
      log:      this.logService.entries(),
      settings: this.settingsService.settings(),
      exportedAt: new Date().toISOString()
    };

    // Create a temporary anchor element and trigger a download
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json'
    });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `devtrack-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    this.message.success('Data exported');
  }

  resetAll(): void {
    // Clear every localStorage key DevTrack owns
    this.storageService.clear('devtrack:tasks');
    this.storageService.clear('devtrack:goals');
    this.storageService.clear('devtrack:log');
    this.storageService.clear('devtrack:settings');

    // Reset the settings service signal to defaults
    this.settingsService.reset();

    // Reset all three forms back to default values
    this.profileForm.patchValue({ displayName: 'Jay' });
    this.appearanceForm.patchValue({ theme: 'light', sidebarCollapsed: false });
    this.defaultsForm.patchValue({ defaultPriority: 'medium', notificationsEnabled: true });
    this.avatarUrl.set('');

    this.message.success('All data cleared');
  }
}
