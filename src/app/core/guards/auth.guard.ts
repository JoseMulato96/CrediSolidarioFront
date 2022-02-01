import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad, CanActivate, Route, UrlSegment } from '@angular/router';
import { AuthenticationService } from '@core/services';
import { UrlRoute } from '@shared/static/urls/url-route';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {

  constructor(private readonly router: Router,
    private readonly authService: AuthenticationService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    if (!this.authService.isTokenExpired()) {
      return true;
    }

    this.router.navigate([UrlRoute.LOGIN], { queryParams: { returnUrl: state.url } });
    return false;
  }

  canLoad(route: Route, segments: UrlSegment[] = []): boolean {

    if (!this.authService.isTokenExpired()) {
      return true;
    }

    const fullPath = segments.reduce((path, currentSegment) => {
      return `${path}/${currentSegment.path}`;
    }, '');

    this.router.navigate([UrlRoute.LOGIN], { queryParams: { returnUrl: fullPath } });
    return false;
  }
}
