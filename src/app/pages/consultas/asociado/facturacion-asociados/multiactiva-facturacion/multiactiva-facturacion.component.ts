import { Component, OnInit, OnDestroy } from '@angular/core';
import { MultiactivaFacturacionConfig } from './multiactiva-facturacion.config';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-multiactiva-facturacion',
  templateUrl: './multiactiva-facturacion.component.html',
})
export class MultiactivaFacturacionComponent implements OnInit, OnDestroy {
  configuracion: MultiactivaFacturacionConfig = new MultiactivaFacturacionConfig();
  _asoNumInt: any;
  _asoNumIntSubscription: any;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) { }

  ngOnInit() {
    this._asoNumIntSubscription = this.route.parent.parent.parent.params.subscribe(
      params => {
        this._asoNumInt = params['asoNumInt'];
        if (!this._asoNumInt) {
          return;
        }

        this.getMultiactiva();
      }
    );
  }

  ngOnDestroy() {
    if (this._asoNumIntSubscription) {
      this._asoNumIntSubscription.unsubscribe();
      this._asoNumIntSubscription = undefined;
    }
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description escucha el boton atras de la tabla
   */
  _OnAtras(e: any) {
    this.getMultiactivaTabla(e.pagina, e.tamano);
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description esucha el boton siguiente de la tabla
   */
  _OnSiguiente(e: any) {
    this.getMultiactivaTabla(e.pagina, e.tamano);
  }

  getMultiactivaTabla(pagina = 0, tamano = 10) {
    this.backService.multiactiva
      .getMultiactivaDatos(this._asoNumInt, pagina, tamano)
      .subscribe((respuestaDatos: any) => {
        const datos: any[] = respuestaDatos.content as any[];
        if (!datos || !datos.length) {
          return;
        }

        this.asignarDatosGrid(datos);
      }, (err) => {
        this.frontService.alert.warning(err.error.message);
      });
  }

  getMultiactiva(pagina = 0, tamano = 10) {
    this.backService.multiactiva
      .getMultiactivaDatos(this._asoNumInt, pagina, tamano)
      .subscribe((respuestaDatos: any) => {
        const datos: any = respuestaDatos;
        const totales: any = respuestaDatos.additionalAttributes;

        if (!datos || datos.content.length === 0) {
          this.translate
            .get('asociado.facturacion.multiactiva.noSeEncontraronRegistrosMensaje')
            .subscribe((response: any) => {
              this.frontService.alert.info(response);
            });

          return;
        }

        this.asignarDatosGrid(datos);
        this.configuracion.panelCalculoMultiactiva.datos = totales;
      }, (err) => {
        this.frontService.alert.warning(err.error.message);
      });
  }

  private asignarDatosGrid(datos: any) {
    return this.configuracion.gridMultiactiva.component.cargarDatos(
      datos.content,
      {
        maxPaginas: datos.totalPages,
        pagina: datos.number,
        cantidadRegistros: datos.totalElements
      }
    );
  }
}
