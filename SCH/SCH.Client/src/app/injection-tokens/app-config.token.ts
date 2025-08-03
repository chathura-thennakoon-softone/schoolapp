import { InjectionToken } from '@angular/core';
import { AppConfig } from '../interfaces/app-config';

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');
