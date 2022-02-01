import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { StoreService } from '@core/services/api-front.services/store.service';
import { Store } from '@ngrx/store';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-validar-datos-registro-asociado',
  templateUrl: './validar-datos-registro-asociado.component.html'
})
export class ValidarDatosRegistroAsociadoComponent
  implements OnInit, AfterViewInit {
  // VARIABLES
  form: FormGroup;

  constructor(
    private readonly router: Router,
    private readonly store: Store<any>,
    private readonly storeService: StoreService,
    private readonly ngxService: NgxUiLoaderService
  ) { }

  ngAfterViewInit() {
    // do nothing
  }
  ngOnInit() {
    // INICIAR CARGADOR
    this.ngxService.start();
    // TERMINAR CARGADOR
    this.ngxService.stop();
  }
}
