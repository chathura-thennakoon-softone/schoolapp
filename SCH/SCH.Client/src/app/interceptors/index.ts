import { HttpInterceptorFn } from '@angular/common/http';
import { jwtInterceptor } from './jwt.interceptor';
import { unauthorizedInterceptor } from './unauthorized.interceptor';
import { serverErrorInterceptor } from './server-error.interceptor';

/**
 * HTTP Interceptors configuration
 *
 * Interceptors are executed in the order they appear in this array.
 * Request flow: top to bottom
 * Response flow: bottom to top
 *
 */
export const httpInterceptors: HttpInterceptorFn[] = [
  jwtInterceptor,
  unauthorizedInterceptor,
  serverErrorInterceptor,
];

// Export individual interceptors for testing or direct use
export { jwtInterceptor } from './jwt.interceptor';
export { unauthorizedInterceptor } from './unauthorized.interceptor';
export { serverErrorInterceptor } from './server-error.interceptor';
