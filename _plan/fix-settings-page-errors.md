# Plan: Fix Settings Page — 9 Build Errors

## Context
`SettingsPage` has a fully-written template with 3 reactive forms, avatar upload, export, and reset — but the component class is completely empty (`export class SettingsPage {}`). This causes 8 TS2339 "property does not exist" errors. A ninth error (NG8002) comes from `NzSegmentedModule` being absent from `imports[]`. Several other modules are also wrong (individual pieces instead of full modules, unused imports, missing ones).

---

## Files to Modify

### `src/app/features/settings/settings-page/settings-page.ts`

#### 1 — Replace `imports[]` with the correct set

**Remove:** `NzFormItemComponent`, `NzColDirective`, `NzSwitchComponent`, `NzTableModule`, `NzSelectModule`  
**Add:** `CommonModule`, `NzFormModule`, `NzSwitchModule`, `NzIconModule`, `NzButtonModule`, `NzPopconfirmModule`, `NzSegmentedModule`  
**Keep:** `NzCardModule`, `NzTabsModule`, `NzUploadModule`, `NzRadioModule`, `NzInputModule`, `ReactiveFormsModule`, `FormsModule`

#### 2 — Implement the class body

```ts
import { Component, inject, signal } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { StorageService } from '../../../core/services/storage.service';

export class SettingsPage {
  private fb      = inject(FormBuilder);
  private message = inject(NzMessageService);
  private storage = inject(StorageService);

  avatarUrl = signal<string | null>(null);

  profileForm = this.fb.nonNullable.group({
    displayName: [''],
  });

  appearanceForm = this.fb.nonNullable.group({
    theme:             ['light'],
    sidebarCollapsed:  [false],
  });

  defaultsForm = this.fb.nonNullable.group({
    defaultPriority:       ['medium'],
    notificationsEnabled:  [true],
  });

  onAvatarSelect = (file: NzUploadFile): boolean => {
    const reader = new FileReader();
    reader.onload = () => this.avatarUrl.set(reader.result as string);
    reader.readAsDataURL(file as unknown as File);
    return false;   // prevent actual HTTP upload
  };

  exportData(): void {
    const payload = {
      tasks: this.storage.read('devtrack:tasks', []),
      goals: this.storage.read('devtrack:goals', []),
      log:   this.storage.read('devtrack:log',   []),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = 'devtrack-export.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  resetAll(): void {
    this.storage.clear('devtrack:tasks');
    this.storage.clear('devtrack:goals');
    this.storage.clear('devtrack:log');
    this.message.success('All data cleared');
  }
}
```

**`src/app/features/settings/settings-page/settings-page.html` — no changes needed.**

---

## Error → Fix Map

| # | Error | Line | Fix |
|---|-------|------|-----|
| 1 | TS2339 `profileForm` | 6 | Add `profileForm` FormGroup to class |
| 2 | TS2339 `onAvatarSelect` | 17 | Add `onAvatarSelect` upload callback |
| 3 | TS2339 `avatarUrl` | 19, 20 | Add `avatarUrl` signal |
| 4 | TS2339 `appearanceForm` | 34 | Add `appearanceForm` FormGroup |
| 5 | TS2339 `defaultsForm` | 60 | Add `defaultsForm` FormGroup |
| 6 | NG8002 `nzOptions` on `nz-segmented` | 65 | Add `NzSegmentedModule` to `imports[]` |
| 7 | TS2339 `exportData` | 79 | Add `exportData()` method |
| 8 | TS2339 `resetAll` | 84 | Add `resetAll()` method |

---

## Key Reuse
- `StorageService` at `src/app/core/services/storage.service.ts` — reuse existing `read()` and `clear()` methods

---

## Verification
1. `npx tsc --noEmit` — zero errors
2. `npx ng build 2>&1 | grep ERROR` — zero errors
3. `npm start` → `/settings`:
   - Profile tab: name input + avatar upload renders
   - Appearance tab: theme radio group + sidebar switch renders
   - Defaults tab: segmented control + notification switch renders
   - Data tab: Export downloads JSON; Reset popconfirm clears localStorage
