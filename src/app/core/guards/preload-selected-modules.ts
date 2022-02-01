import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthGuard } from '@core/guards';

@Injectable({
  providedIn: 'root'
})
export class PreloadSelectedModules implements PreloadingStrategy {

  constructor(private readonly authGuard: AuthGuard) { }

  preload(route: Route, load: () => Observable<any>): Observable<any> {
    return route.data && route.data.preload && this.authGuard.canLoad(route) ? load() : of(null);
  }
}
