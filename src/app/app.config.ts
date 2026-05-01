import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { provideNzConfig, NzConfig } from 'ng-zorro-antd/core/config'; // NEW

registerLocaleData(en);

const ngZorroConfig: NzConfig = {
  message:      { nzTop: 80, nzDuration: 3000, nzMaxStack: 3 },
  notification: { nzPlacement: 'topRight', nzDuration: 4500 },
  card:         { nzSize: 'default' },
  table:        { nzSize: 'middle', nzBordered: false }
};
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideNzI18n(en_US),
    provideNzConfig(ngZorroConfig),
  ],
};
