import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { UnauthorizedInterceptor } from './unauthorized.interceptor';
import { ServerErrorInterceptor } from './server-error.interceptor';

/**
 * HTTP Interceptors configuration
 * 
 * Interceptors are executed in the order they appear in this array.
 * Request flow: top to bottom
 * Response flow: bottom to top
 * 
 * Current execution order:
 * 1. UnauthorizedInterceptor - Handles HTTP 401 errors and redirects to /unauthorized
 * 2. ServerErrorInterceptor - Handles HTTP 500 errors and redirects to /servererror
 * 
 * To add new interceptors:
 * 1. Import the interceptor class
 * 2. Add it to the HTTP_INTERCEPTORS_PROVIDERS array in the desired order
 * 3. Update the documentation above
 */
export const HTTP_INTERCEPTORS_PROVIDERS = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: UnauthorizedInterceptor,
    multi: true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ServerErrorInterceptor,
    multi: true
  }
  // Add new interceptors here in the desired execution order
  // Example:
  // {
  //   provide: HTTP_INTERCEPTORS,
  //   useClass: AuthInterceptor,
  //   multi: true
  // },
  // {
  //   provide: HTTP_INTERCEPTORS,
  //   useClass: LoggingInterceptor,
  //   multi: true
  // }
];

// Export individual interceptors for testing or direct use
export { UnauthorizedInterceptor } from './unauthorized.interceptor';
export { ServerErrorInterceptor } from './server-error.interceptor';
