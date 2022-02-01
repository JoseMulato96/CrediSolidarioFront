import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatosAsociado } from '@shared/models';
import { Subscription } from 'rxjs';
import { UrlRoute } from '@shared/static/urls/url-route';
import { DataService } from '@core/store/data.service';
import { Acciones } from '@core/store/acciones';
import { DatosAsociadoWrapper } from '@core/store/asociado-data.service';
import { CustomValidators } from '@shared/util';
import { TranslateService } from '@ngx-translate/core';
import { masksPatterns } from '@shared/util/masks.util';
import { EventoAsociadosService } from '../services/evento-asociados.service';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { StoreService } from '@core/services';

@Component({
  selector: 'app-datos-asociados',
  templateUrl: './datos-asociados.component.html'
})
export class DatosAsociadosComponent implements OnInit {
  form: FormGroup;

  datosAsociado: DatosAsociado;
  _asoNumInt = '';
  _tipoAsociado = '';
  _datos: any = {};
  subservice: Subscription;
  asociadoSubscription: Subscription;
  patterns = masksPatterns;

  esResponsablePago: boolean = false;
  esAsegurado: boolean = false;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly translate: TranslateService,
    private readonly dataService: DataService,
    private readonly eventoAsociado: EventoAsociadosService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService,
    private readonly formBuilder: FormBuilder,
    private readonly storeService: StoreService
  ) {
  }

  ngOnInit() {
    this.validateFormRegistro();

    this.route.parent.params.subscribe(params => {
      this._asoNumInt = params['asoNumInt'];
      if (!this._asoNumInt) {
        return;
      }

      this.asociadoSubscription = this.dataService
        .asociados()
        .asociado.subscribe((respuesta: DatosAsociadoWrapper) => {
          if (!respuesta || respuesta.datosAsociado.numInt !== this._asoNumInt) {
            //this._publicarDatosAsociado();
            return;
          }

          this.datosAsociado = respuesta.datosAsociado;

          this.eventoAsociado.atras().next({ mostrar: false });
          this.eventoAsociado.summenu().next({ mostrar: true });
          if(this.datosAsociado){
            this.encontrarAsociadoNitCli(this.datosAsociado.nitCli);
          }
        });
    });
  }

  async encontrarAsociadoNitCli(nitCli: any){
    await this.backService.asociado.buscarAsociado({ nitCli, isPaged: true, page: 0, size: 10 }).subscribe((respuesta: any) => {
      if (!respuesta.content && !respuesta.content.length) {
        this.translate.get('asociado.noSeEncontraronRegistrosMensaje').subscribe((response: string) => {
          this.frontService.alert.info(response);
        });
        return;
      }
      if(respuesta){
        //Filtramos el tipo de asociado que se requiere ver
        this._tipoAsociado = this.storeService.getTipoAsegurado();
        let datosAsociado = null;
        for (const item of respuesta.content) { 
          if(item.tipoAsociado == this._tipoAsociado) {
            datosAsociado = item;
          }        
        }
        this.datosAsociado.tipoAsociado = datosAsociado.tipoAsociado;
        this.datosAsociado.cliente = datosAsociado.cliente;
        
        if(this.datosAsociado.tipoAsociado === MIM_PARAMETROS.MIM_TIPO_ASOCIADO.ASEGURADO){
          this.esAsegurado = true;
          this.esResponsablePago = false
        }
        if(this.datosAsociado.tipoAsociado === MIM_PARAMETROS.MIM_TIPO_ASOCIADO.RESPONSABLE_PAGO){
          this.esResponsablePago = true;
          this.esAsegurado = false;
        }
      }
    }, (err: any) => {
      this.frontService.alert.error(err.error.message);
    });    
  }

  ngDestroy() {
    if (this.asociadoSubscription) {
      this.asociadoSubscription.unsubscribe();
      this.asociadoSubscription = undefined;
    }
  }

  /**
   * @description Publicar datos de asociado.
   *
   */
  _publicarDatosAsociado() {
    this.dataService
      .asociados()
      .accion(Acciones.Publicar, this._asoNumInt, true);
  }

  validateFormRegistro() {
    this.form = this.formBuilder.group({
      formBucarAsociadosID: ['']
    });
  }

  /**
   * @description Retorna la clase para el indicador de fecha de nacimiento correspondiente
   *
   * @param indicador Indicador de fecha de nacimiento.
   */
  calcularIndFecNac(indicador: number) {
    switch (indicador) {
      case 1:
        return ['icon-Valida', 'text--green2'];
      case 2:
        return ['icon-Pendiente', 'text--red1'];
      case 3:
        return ['icon-No-valida', 'text--gray2'];
      default:
        return ['icon-No-valida', 'text--gray2'];
    }
  }

  /**
   * @description Submit de buscar asociados.
   */
  formBucarAsociados() {
    if (
      CustomValidators.CampoVacio(this.form.controls.formBucarAsociadosID.value)
    ) {
      return;
    }

    const nitCli = this.form.controls.formBucarAsociadosID.value;
    // Buscamos el asociado por nitCli para obtener el asoNumInt.
    this.backService.asociado.buscarAsociado({ nitCli, isPaged: true, page: 0, size: 1 }).subscribe((respuesta: any) => {
      if (!respuesta.content && !respuesta.content.length) {
        this.translate.get('asociado.noSeEncontraronRegistrosMensaje').subscribe((response: string) => {
          this.frontService.alert.info(response);
        });
        return;
      }

      const datosAsociado = respuesta.content[0];

      // Agregamos loa datos al data service.
      this.dataService.asociados().accion(Acciones.Publicar, datosAsociado, false);

      this.router.navigate([
        UrlRoute.PAGES,
        UrlRoute.CONSULTAS,
        UrlRoute.CONSULTAS_ASOCIADO,
        datosAsociado.numInt,
        UrlRoute.CONSULTAS_ASOCIADO_DATOS_ASOCIADO
      ]);
    }, (err: any) => {
      this.frontService.alert.error(err.error.message);
    });
  }
}
