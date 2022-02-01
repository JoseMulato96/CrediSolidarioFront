import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { ErrorInterceptor, JwtInterceptor } from '@core/interceptors';
import { AuthGuard, CanDeactivateGuard, CanActivateValidatorStatusPlanGuard  } from './guards';
import { DataService } from './store/data.service';
import { ScopeGuard } from './guards/scope.guard';
import { BackFacadeService } from './services/back-facade.service';
import { FrontFacadeService } from './services/front-facade.service';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    ErrorInterceptor,
    JwtInterceptor,
    AuthGuard,
    CanActivateValidatorStatusPlanGuard,
    CanDeactivateGuard,
    ScopeGuard,
    DataService,
    BackFacadeService,
    FrontFacadeService
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() core: CoreModule) {
    if (core) {
      throw new Error('You shall not run!');
    }
  }
}
