import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '@core/store/data.service';
import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';
import { SERVICIOS_PARAMETROS_BENEFICIARIO } from '@shared/static/constantes/servicios-parametros';
import { Subscription } from 'rxjs';
import { BeneficiariosNovendadesHistoricoConfig } from './beneficiarios-novedades-historico.config';
import { Acciones } from '@core/store/acciones';
import { Location } from '@angular/common';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-beneficiarios-novedades-historico',
  templateUrl: './beneficiarios-novedades-historico.component.html',
})
export class BeneficiariosNovedadesHistoricoComponent implements OnInit, OnDestroy {
  benNumIdentificacion: any;
  builded: Promise<MimGridConfiguracion>;
  cliNumIdent: string;
  codBeneficiario: string;
  subs: Subscription[] = [];
  paramsBusqueda: any;
  configuracion: BeneficiariosNovendadesHistoricoConfig = new BeneficiariosNovendadesHistoricoConfig();

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly dataService: DataService,
    private readonly location: Location,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) { }

  ngOnInit() {
    this.subs.push(
      this.route.parent.params.subscribe(params => {
        this.codBeneficiario = params['codBeneficiario'];
      }),

      this.route.queryParams.subscribe(params => {
        this.paramsBusqueda = params;
      }),

      this.route.params.subscribe(params => {
        this.cliNumIdent = params['cliNumIdent'];
      }),

      this.dataService.beneficiarios().beneficiario.subscribe(dato => {
        if (dato && dato.accion === Acciones.Publicar) {
          dato.datosBeneficiario._esAsociado = dato.datosBeneficiario.esAsociado ? 'Si' : 'No';
          this.configuracion.dllUsuario.datos = dato.datosBeneficiario;
          this.getBeneficiariosHistorico();
        } else if (
          (!dato || dato.accion === Acciones.Borrar) &&
          this.codBeneficiario
        ) {
          this.getBeneficiarioPorCodigo();
        }
      })
    );
  }

  ngOnDestroy() {
    (this.subs || []).forEach(x => x.unsubscribe());
    this.subs = undefined;
  }


  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Escucha cuando la hace click al boton atras
   */
  onAtras(e) {
    this.getBeneficiariosHistorico();
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description escucha cuando la hace click al boton siguiente
   */
  onSiguiente(e) {
    this.getBeneficiariosHistorico();
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description ir atras
   */
  irAtras() {
    this.location.back();
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description seleciona el el sub menu
   */
  seleccionOpcion(router: string[]) {
    const url = router.join('/');
    this.router.navigate([url], { queryParams: this.paramsBusqueda });
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Obtener los beneficiario de informacion
   */
  private getBeneficiariosHistorico() {
    const page: any = this.configuracion.gridHistorico.pagina;
    const size: any = this.configuracion.gridHistorico.tamano;

    this.builded = null;
    this.backService.beneficiarios
      .getBeneficiariosHistorico(this.codBeneficiario, this.cliNumIdent, {
        page,
        size,
        estados: SERVICIOS_PARAMETROS_BENEFICIARIO.informacion.estadoHistorico
      })
      .subscribe((respuesta: any) => {
        if (!respuesta || respuesta.content.length === 0) {
          return;
        }

        this.configuracion.gridHistorico.component.cargarDatos(
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
