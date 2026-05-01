import { Component, inject, signal, computed, effect } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { SettingsService } from '../../core/services/settings-service';
@Component({
  selector: 'app-main-layout',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    NzAvatarModule,
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  private settingsService = inject(SettingsService); 

   // NEW — reads the collapsed default from settings, falls back to false
  collapsed = signal(this.settingsService.settings().sidebarCollapsed);

  // NEW — reactive display name initial for the avatar
  avatarInitial = computed(() =>
    this.settingsService.settings().displayName?.charAt(0).toUpperCase() || 'J'
  );

  // NEW — reactive display name for the header tooltip / title
  displayName = computed(() =>
    this.settingsService.settings().displayName || 'Jay'
  );

  // NEW — reactive avatar URL (set when user uploads a photo in Settings)
  avatarUrl = computed(() =>
    this.settingsService.settings().avatarUrl
  );

  constructor() {
    // NEW — when the settings change (e.g. user saves sidebarCollapsed = true),
    // sync the sidebar state. Only applies if the sidebar is not currently
    // being manually toggled by the user.
    effect(() => {
      const defaultCollapsed = this.settingsService.settings().sidebarCollapsed;
      this.collapsed.set(defaultCollapsed);
    }, { allowSignalWrites: true });
  }

  toggleCollapse() {
    this.collapsed.update(v => !v);
  }

}
