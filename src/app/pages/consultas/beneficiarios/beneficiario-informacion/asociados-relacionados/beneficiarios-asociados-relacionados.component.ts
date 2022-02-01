import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '@core/store/data.service';
import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';
import { SERVICIOS_PARAMETROS_BENEFICIARIO } from '@shared/static/constantes/servicios-parametros';
import { UrlRoute } from '@shared/static/urls/url-route';
import { Subscription } from 'rxjs';
import { BeneficiariosAsociadosRelacionadoConfig } from './beneficiarios-asociados-relacionados.config';
import { Acciones } from '@core/store/acciones';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-beneficiarios-asociados-relacionados',
  templateUrl: './beneficiarios-asociados-relacionados.component.html',
})
export class BeneficiariosAsociadosRelacionadosComponent implements OnInit, OnDestroy {

  redireccion: any;
  paramsBusqueda: any;
  builded: Promise<MimGridConfiguracion>;
  subs: Subscription[] = [];
  codBeneficiario: string;
  benNumIdentificacion: string;
  configuracion: BeneficiariosAsociadosRelacionadoConfig = new BeneficiariosAsociadosRelacionadoConfig();

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly dataService: DataService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) { }

  ngOnInit() {
    this.subs = [
      this.route.parent.params.subscribe(params => {
        this.codBeneficiario = params['codBeneficiario'];
      }),

      this.dataService.beneficiarios().beneficiario.subscribe(dato => {
        if (dato && dato.accion === Acciones.Publicar) {
          dato.datosBeneficiario._esAsociado = dato.datosBeneficiario.esAsociado ? 'Si' : 'No';
          this.configuracion.dllUsuario.datos = dato.datosBeneficiario;
        } else if (
          (!dato || dato.accion === Acciones.Borrar) &&
          this.codBeneficiario
        ) {
          this.getBeneficiarioPorCodigo();
        }
      }, (err: any) => {
        this.frontService.alert.error(err.error.message);
      }),

      this.route.queryParams.subscribe(params => {
        this.paramsBusqueda = params;
        this.redireccion = this.paramsBusqueda.vista;

      })
    ];
    this.getBeneficiarioAsociadosRelacion();
  }

  ngOnDestroy() {
    (this.subs || []).forEach(x => x.unsubscribe());
    this.subs = undefined;
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description escucha cuando la hace click al boton atras
   */
  onAtras(e) {
    this.getBeneficiarioAsociadosRelacion();
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description escucha cuando la hace click al boton siguiente
   */
  onSiguiente(e) {
    this.getBeneficiarioAsociadosRelacion();
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description ir atras
   */
  irAtras() {
    // No usamos this.location.back() debido a que necesitamos que trasciendan los parametros de busqueda.
    this.router.navigate(
      [this.redireccion],
      { queryParams: this.paramsBusqueda }
    );
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description escucha cuando hace click
   */
  onClickLink(e) {
    this.router.navigate(
      [
        UrlRoute.PAGES,
        UrlRoute.CONSULTAS,
        UrlRoute.BENEFICIARIOS,
        UrlRoute.BENEFICIARIOS_INFORMACION,
        this.codBeneficiario,
        UrlRoute.BENEFICIARIOS_ASOCIADO_RELACIONADOS,
        e['asoNumInt'],
        UrlRoute.BENEFICIARIOS_NOVEDANDES_HISTORICO
      ],
      { queryParams: this.paramsBusqueda }
    );
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description seleciona el el sub menu
   */
  seleccionOpcion(router: string[]) {
    const url = router.join('/');
    this.router.navigateByUrl(url);
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Obtener los beneficiario de informacion
   */
  private getBeneficiarioAsociadosRelacion() {
    const page: any = this.configuracion.gridRelacionado.pagina;
    const size: any = this.configuracion.gridRelacionado.tamano;

    this.builded = null;

    this.backService.beneficiarios
      .getBeneficiariosAsociadoRelacionado(this.codBeneficiario, {
        page,
        size,
        estados: SERVICIOS_PARAMETROS_BENEFICIARIO.informacion.estados
      })
      .subscribe((respuesta: any) => {
        if (!respuesta || respuesta.content.length === 0) {
          return;
        }

        this.configuracion.gridRelacionado.component.cargarDatos(
          respuesta.content,
          {
            maxPaginas: respuesta.totalPages,
            pagina: respuesta.number,
            cantidadRegistros: respuesta.totalElements
          }
        );
      }, (err: any) => {
        this.frontService.alert.error(err.error.message);
      });
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Obtener los beneficiario de informacion
   */
  private getBeneficiarioPorCodigo() {
    this.backService.beneficiarios
      .getBenetificiarioPorCodigo(this.codBeneficiario)
      .subscribe(respuesta => {
        if (!respuesta) {
          return;
        }

        const datos: any = respuesta;
        this.dataService.beneficiarios().accion(Acciones.Publicar, datos);
      }, (err: any) => {
        this.frontService.alert.error(err.error.message);
      });
  }
}
