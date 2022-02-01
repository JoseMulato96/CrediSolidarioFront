import { Injectable } from '@angular/core';
import { AsociadoDataService } from './asociado-data.service';
import { BeneficiariosDataService } from './benficiarios-data.service';
import { BackFacadeService } from '@core/services/back-facade.service';
import { FrontFacadeService } from '@core/services/front-facade.service';

@Injectable()
export class DataService {
  /**
   *
   * @description Servicio de datos del asociado.
   */
  private _asociadoDataService: AsociadoDataService;

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Servicio de datos del beneficiario
   */
  private _beneficiarioDataService: BeneficiariosDataService;

  constructor(
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService,
  ) { }

  asociados(): AsociadoDataService {
    return (
      this._asociadoDataService ||
      (this._asociadoDataService = new AsociadoDataService(
        this.frontService,
        this.backService
      ))
    );
  }

  beneficiarios(): BeneficiariosDataService {
    return (
      this._beneficiarioDataService ||
      (this._beneficiarioDataService = new BeneficiariosDataService())
    );
  }
}
