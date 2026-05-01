import { Injectable, effect, inject, signal } from '@angular/core';
import { StorageService } from './storage.service';

export type Theme = 'light' | 'dark' | 'compact';
export type Priority = 'low' | 'medium' | 'high';

export interface AppSettings {
  displayName:          string;
  theme:                Theme;
  sidebarCollapsed:     boolean;
  defaultPriority:      Priority;
  notificationsEnabled: boolean;
  avatarUrl:            string;
}

const DEFAULTS: AppSettings = {
  displayName:          'Jay',
  theme:                'light',
  sidebarCollapsed:     false,
  defaultPriority:      'medium',
  notificationsEnabled: true,
  avatarUrl:            ''
};

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private storage   = inject(StorageService);

  private _settings = signal<AppSettings>(
    this.storage.read<AppSettings>('devtrack:settings', DEFAULTS)
  );

  readonly settings = this._settings.asReadonly();

  constructor() {
    effect(() => {
      this.storage.write('devtrack:settings', this._settings());
      // applies data-theme attribute so CSS can target it later
      document.documentElement.setAttribute('data-theme', this._settings().theme);
    });
  }

  patch(partial: Partial<AppSettings>): void {
    this._settings.update(s => ({ ...s, ...partial }));
  }

  reset(): void {
    this._settings.set(DEFAULTS);
  }
}