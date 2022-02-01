import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { PreexistenciasConfig } from './preexistencias.config';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { IPage } from '@shared/interfaces/page.interface';
import { TranslateService } from '@ngx-translate/core';
import { IngresarPreexistenciaComponent } from './ingresar-preexistencia/ingresar-preexistencia.component';
import { UrlRoute } from '@shared/static/urls/url-route';
import { ActualizarImcComponent } from './actualizar-imc/actualizar-imc.component';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-preexistencias',
  templateUrl: './preexistencias.component.html',
  styleUrls: ['./preexistencias.component.css']
})
export class PreexistenciasComponent implements OnInit, OnDestroy {

  _asoNumInt: string;
  _asoSubscription: Subscription;
  configuracion: PreexistenciasConfig = new PreexistenciasConfig();
  builded: Promise<any>;
  preexistencias: IPage<any>;

  @ViewChild(ActualizarImcComponent)
  actualizarImcComponent: ActualizarImcComponent;

  @ViewChild(IngresarPreexistenciaComponent)
  ingresarPreexistenciaComponent: IngresarPreexistenciaComponent;

  menuConsultaPreexistencias: any;

  constructor(
    private readonly router: Router,
    private readonly translate: TranslateService,
    private readonly route: ActivatedRoute,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) { }

  ngOnInit() {
    this._asoSubscription = this.route.parent.parent.params.subscribe(params => {
      this._asoNumInt = params['asoNumInt'];
      if (!this._asoNumInt) {
        return;
      }

      this.getPreexistencias(
        this._asoNumInt,
        this.configuracion.gridPreexistencias.pagina,
        this.configuracion.gridPreexistencias.tamano);
    });

    // Obtenemos el menu de la pagina para procesa permisos.
    this.menuConsultaPreexistencias = this.frontService.scope.obtenerMenu([
      'MM_CONSULTA',
      'MM_FLOTANTE_CONSULTA_ASOCIADO',
      'MM_CONSUL_ASOC_PREEXISTENCIAS'], false);
  }

  ngOnDestroy() {
    if (this._asoSubscription) {
      this._asoSubscription.unsubscribe();
    }
  }

  _OnAtras($event) {
    this.getPreexistencias(
      this._asoNumInt,
      this.configuracion.gridPreexistencias.pagina,
      this.configuracion.gridPreexistencias.tamano);
  }

  _OnSiguiente($event) {
    this.getPreexistencias(
      this._asoNumInt,
      this.configuracion.gridPreexistencias.pagina,
      this.configuracion.gridPreexistencias.tamano);
  }

  /**
   * @description Obtiene las preexistencias de un asociado.
   *
   */
  getPreexistencias(asoNumInt: string, page: number, size: number) {
    this.backService.preexistencia.getPreexistencias({
      asoNumInt: asoNumInt,
      page: page,
      size: size
    }).subscribe((result: any) => {
      this.configuracion.gridPreexistencias.component.limpiar();

      if (!result.content || result.content.length === 0) {
        this.translate.get('asociado.preexistencias.noSeEncontraronRegistrosMensaje').subscribe((response: any) => {
          this.frontService.alert.info(response);
        });

        return;
      }

      this.preexistencias = result;
      this.configuracion.gridPreexistencias.component.cargarDatos(
        result.content,
        {
          maxPaginas: result.totalPages,
          pagina: result.number,
          cantidadRegistros: result.totalElements
        }
      );
    }, (err: any) => {
      this.frontService.alert.error(err.error.message);
    });

  }

  /**
   *
   * @description Agregar preexistencia
   */
  _onAgregarPreexistencia() {
    this.ingresarPreexistenciaComponent.onOpen();
  }

  _onActualizarMasaCorporal() {
    this.actualizarImcComponent.onOpen();
  }

  /**
   * @description Captura evento al guardar exitosamente una preexistencia.
   *
   * @param $event Evento
   */
  _onSavePreexistencia($event: any) {
    this.getPreexistencias(
      this._asoNumInt,
      this.configuracion.gridPreexistencias.pagina,
      this.configuracion.gridPreexistencias.tamano);
  }

  /**
   * @description Al dar click en una celda.
   *
   * @param $event Evento
   */
  _OnClickCelda($event: any) {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.CONSULTAS,
      UrlRoute.CONSULTAS_ASOCIADO,
      this._asoNumInt,
      UrlRoute.PREEXISTENCIAS,
      $event.preCod
    ]);
  }

  tienePermisos(permiso: string) {
    return this.frontService.scope.tienePermisos(permiso, this.menuConsultaPreexistencias ?
      this.menuConsultaPreexistencias.appObject.operations : []);
  }
}
