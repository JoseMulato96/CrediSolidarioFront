import { Injectable } from '@angular/core';
import { StoreService } from './api-front.services/store.service';
import { AlertService } from './api-front.services/alert.service';
import { AuthenticationService } from './api-front.services/authentication.service';
import { ScopeService } from './api-front.services/scope.service';

/**
 * @description
 * Proporciona una interfaz unificada para un conjunto de interfaces en el sistema,
 * encapsulando los subsistemas dentro de una sola interfaz.
 */
@Injectable({
    providedIn: 'root',
})
export class FrontFacadeService {
  constructor(
      private readonly authenticationService: AuthenticationService,
      private readonly alertService: AlertService,
      private readonly storeService: StoreService,
      private readonly scopeService: ScopeService

  ) { }

  public get authentication(): AuthenticationService {
      return this.authenticationService;
  }

  public get alert(): AlertService {
    return this.alertService;
  }

  public get redux(): StoreService {
    return this.storeService;
  }

  public get scope(): ScopeService {
    return this.scopeService;
  }

}
