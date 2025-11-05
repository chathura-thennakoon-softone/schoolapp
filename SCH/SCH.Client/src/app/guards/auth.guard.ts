import { inject } from '@angular/core';
import {
  Router,
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Auth } from '../services/auth';

/**
 * Auth guard to protect routes that require authentication
 */
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean | UrlTree => {
  const authService = inject(Auth);
  const router = inject(Router);

  let result: boolean | UrlTree;

  if (authService.isAuthenticated()) {
    result = true;
  } else {
    result = router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url },
    });
  }

  return result;
};

/**
 * Role-based auth guard
 * Usage: canActivate: [roleGuard], data: { roles: ['Admin'] }
 */
export const roleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean | UrlTree => {
  const authService = inject(Auth);
  const router = inject(Router);

  let result: boolean | UrlTree;

  if (authService.isAuthenticated()) {
    const requiredRoles = route.data['roles'] as string[];

    if (!requiredRoles || requiredRoles.length === 0) {
      result = true;
    } else if (authService.hasAnyRole(requiredRoles)) {
      result = true;
    } else {
      result = router.createUrlTree(['/unauthorized']);
    }
  } else {
    result = router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url },
    });
  }

  return result;
};

/**
 * Admin guard - shortcut for admin-only routes
 */
export const adminGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean | UrlTree => {
  const authService = inject(Auth);
  const router = inject(Router);

  let result: boolean | UrlTree;

  if (authService.isAuthenticated()) {
    if (authService.isAdmin()) {
      result = true;
    } else {
      result = router.createUrlTree(['/unauthorized']);
    }
  } else {
    result = router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url },
    });
  }

  return result;
};


