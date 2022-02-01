import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BeneficiarioDetalleConfiguracion } from '@shared/components/beneficiario-detalle/beneficiario-detalle.component';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { APP_PARAMETROS } from '@shared/static/constantes/app-parametros';
import { UrlRoute } from '@shared/static/urls/url-route';
import { BeneficiariosAsociadosConfig } from './beneficiarios-asociados.config';
import { EventoAsociadosService } from '../services/evento-asociados.service';
import { ReportParams } from '@shared/models/report-params.model';
import { FileUtils } from '@shared/util/file.util';
import { DatosAsociadoWrapper } from '@core/store/asociado-data.service';
import { DataService } from '@core/store/data.service';
import { DateUtil } from '@shared/util/date.util';
import { SIP_LOG_TRANSACCIONAL } from '@shared/static/constantes/sip-log-transaccional';
import { SERVICIOS_PARAMETROS } from '@shared/static/constantes/servicios-parametros';
import { environment } from '@environments/environment';
import { BackFacadeService } from '@core/services/back-facade.service';
import { FrontFacadeService } from '@core/services/front-facade.service';

@Component({
  selector: 'app-beneficiarios-asociados',
  templateUrl: './beneficiarios-asociados.component.html',
  styleUrls: ['./beneficiarios-asociados.component.css']
})
export class BeneficiariosAsociadosComponent implements OnInit, OnDestroy {
  active: number;
  butonExportActive = true;
  _asoNumInt: any;
  _subs: Subscription[] = [];
  detalles = APP_PARAMETROS.BENEFICIARIO_DETALLES[0];
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description obtiene los tipo de paramentros de la vista
   */
  parametrosVista = APP_PARAMETROS.BENEFICIARIO_NUEVO;
  listaBeneficiarios: any[];
  _agrupado: any[] = [];
  configuracion: BeneficiariosAsociadosConfig = new BeneficiariosAsociadosConfig();
  beneficiario: BeneficiarioDetalleConfiguracion[] = [];
  funerarios: BeneficiarioDetalleConfiguracion[] = [];
  datosAsociado: any;
  _datoEliminar: {
    codigoBeneficiario?: any,
    tipoBen?: any,
    beneficiariosRelacionados?: any[]
  } = {};
  usuario: any;
  menuConsultaAsocBeneficiarios: any;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly translate: TranslateService,
    private readonly eventoAsociado: EventoAsociadosService,
    private readonly dataService: DataService,
    private readonly backService: BackFacadeService,
    private readonly frontService: FrontFacadeService
  ) {
  }

  ngOnInit() {
    // Configuramos la pagina.
    this._subs.push(
      this.route.parent.params.subscribe(params => {
        this._asoNumInt = params['asoNumInt'];
        if (!this._asoNumInt) {
          return;
        }

        this.dataService
          .asociados()
          .asociado.subscribe((respuesta: DatosAsociadoWrapper) => {
            if (!respuesta || respuesta.datosAsociado.numInt !== this._asoNumInt) {
              return;
            }
            this.datosAsociado = respuesta.datosAsociado;
          });

        this.getBeneficiarios();
      })
    );

    // Configuramos el boton atras.
    this.eventoAsociado.summenu().next({ mostrar: true });
    this.eventoAsociado.atras().next({ mostrar: false });

    // Obtenemos el menu de la pagina para procesa permisos.
    this.menuConsultaAsocBeneficiarios = this.frontService.scope.obtenerMenu([
      'MM_CONSULTA',
      'MM_FLOTANTE_CONSULTA_ASOCIADO',
      'MM_CONSUL_ASOC_BENEFICIARIOS'], false);
  }

  ngOnDestroy() {
    this._subs.forEach(subs => subs.unsubscribe());
    this._subs = null;
    this.frontService.alert.close();
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Obtener los beneficiario
   */
  getBeneficiarios() {
    this.backService.beneficiario.validarPlanEducativo(this._asoNumInt).subscribe(
      (respuesta: any[]) => {
        if (respuesta && respuesta.length > 0) {
          this.translate.get('asociado.beneficiario.planEducativoNoAsignado.alertNoAsignado')
            .subscribe((text: string) => {
              this.frontService.alert.warning(text).then(() => {
                this.router.navigate([
                  UrlRoute.PAGES, UrlRoute.CONSULTAS, UrlRoute.CONSULTAS_ASOCIADO, this._asoNumInt,
                  UrlRoute.BENEFICIARIOS_ASOCIADO, UrlRoute.NUEVO_BENEFICIARIO
                ],
                  {
                    queryParams: {
                      tipoBen: respuesta[0].tipoBen,
                      codigoProt: respuesta[0].codigoProt
                    }
                  });

              });
            });
        }
      }
    );
    const param = {
      codEstadoBenAso: SERVICIOS_PARAMETROS.beneficiarios.codEstadoBenAso,
      codEstadoBeneficiario: SERVICIOS_PARAMETROS.beneficiarios.codEstadoBeneficiario,
      codEstadoInactivo: SERVICIOS_PARAMETROS.beneficiarios.codEstadoInactivo,
      codEstadosBenAso: SERVICIOS_PARAMETROS.beneficiarios.codEstadosBenAso,
      codTipoBeneficiario: SERVICIOS_PARAMETROS.beneficiarios.codTipoBeneficiario.todos

    };
    this.backService.beneficiario.getBeneficiarios(this._asoNumInt, param).subscribe(
      (respuesta: any[]) => {
        if (!respuesta || respuesta.length === 0) {
          this.translate
            .get('asociado.beneficiario.noSeEncontraronRegistrosMensaje')
            .subscribe((response: string) => {
              this.frontService.alert.info(response);
            });
          this.butonExportActive = false;
          this._agrupado = [];
          return;
        }
        this.listaBeneficiarios = respuesta;
        this._agrupado = [];

        respuesta.forEach(x => {
          let element: any = this._agrupado.find(y => y.desGrupo === x.desGrupo);
          if (!element) {
            element = {
              desGrupo: x.desGrupo,
              valores: []
            };
            APP_PARAMETROS.BENEFICIARIO_DETALLES.forEach(params => {
              if (element.desGrupo === params.value) {
                element.css = params.css;
              }
            });
            this._agrupado.push(element);
          }

          x.numInt = this._asoNumInt;
          element.valores.push(x);
        });

      },
      err => {
        this.frontService.alert.error(err.error.message, err.error.traza);
      }
    );
  }

  toogleCollpase(index: number) {
    this.active = index;
  }

  editarBeneficiarios(idNumber) {
    this.router.navigate([
      '/pages',
      'asociado',
      'nuevo-beneficiario',
      idNumber
    ]);
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description escucha el evento eliminar
   */
  _onEliminar(itemBeneficiario) {
    /// se valida si puede eliminar
    this._datoEliminar = {};
    this.translate
      .get('asociado.beneficiario.alertEliminar')
      .subscribe(text => {
        this.frontService.alert.confirm(text, 'danger').then(async afirmacion => {
          if (!afirmacion) {
            return;
          }

          const codBeneficiario = itemBeneficiario.codBeneficiario;
          const tipoCod = itemBeneficiario.tipoCod;

          if (tipoCod !== Number(this.parametrosVista.TIPO_BENEFICIARIO.SOLIDARIDAD)) {
            this.eliminarBeneficiario({
              codigoBeneficiario: codBeneficiario,
              tipoBen: tipoCod,
              beneficiariosRelacionados: []
            });
            return;
          }
          /// se coloca el servicio de eliminacio

          const config = this.configuracion.beneficiariosPorcejate;
          let beneficiarios = await this._extraerBeneficiarios();
          beneficiarios = beneficiarios.filter(x => {
            x._ocultar = true;
            return x.codBeneficiario !== codBeneficiario;
          });

          if (!beneficiarios.length) {
            this.eliminarBeneficiario({
              codigoBeneficiario: codBeneficiario,
              tipoBen: tipoCod,
              beneficiariosRelacionados: []
            });
            /// se valida si hay dos registros el que se va eliminar y el que se va a quedar con el porcentaje 100%
          } else if (beneficiarios.length === 1) {
            const datos = JSON.parse(JSON.stringify(beneficiarios));
            return this.eliminarBeneficiario({
              codigoBeneficiario: codBeneficiario,
              tipoBen: tipoCod,
              beneficiariosRelacionados: [{
                porcentajeBen: 100,
                benCod: datos[0].codBeneficiario,
                tipoCod: datos[0].tipoCod,
                borrar: false
              }, {
                porcentajeBen: -1,
                benCod: codBeneficiario,
                tipoBen: tipoCod,
                borrar: true
              }]
            });
            //// se distribuye
          } else {
            const datos = JSON.parse(JSON.stringify(beneficiarios));
            this._datoEliminar = {
              codigoBeneficiario: codBeneficiario,
              tipoBen: tipoCod,
              beneficiariosRelacionados: []
            };
            /// se carga los datos
            config.component.cargarDatos(datos);
            this.configuracion.winPorcentaje.component.mostrar();
          }
        });
      });
  }

  /**
  * @author Jorge Luis Caviedes Alvarado
  * @description se elimina el beneficiario
  */
  eliminarBeneficiario(dato) {
    this.backService.beneficiario.deleteBeneficiario(this._asoNumInt, dato).subscribe((resultado: any) => {
      this.frontService.alert.success(resultado.mensaje).then(
        () => {
          this.configuracion.winPorcentaje.component.ocultar();
          this.getBeneficiarios();
        }
      );

    }, error => {
      if (error.status === 400) {
        this.frontService.alert.warning(error.error.message);
      }
    });
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description extrae los beneficiarios que esta relacionado
   */
  async _extraerBeneficiarios() {
    const beneficiarios: any = this._agrupado.filter(
      x => x.desGrupo === this.parametrosVista.PORCENTAJE.value
    );

    if (
      beneficiarios &&
      beneficiarios[0] &&
      beneficiarios[0].valores &&
      beneficiarios[0].valores.length
    ) {
      return beneficiarios[0].valores;
    }
    return [];
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description  escucha el evento editar
   */
  _onEditar(e) {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.CONSULTAS,
      UrlRoute.CONSULTAS_ASOCIADO,
      this._asoNumInt,
      UrlRoute.BENEFICIARIOS_ASOCIADO,
      e.codBeneficiario,
      e.tipoCod
    ]);
  }

  _onAgregar() {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.CONSULTAS,
      UrlRoute.CONSULTAS_ASOCIADO,
      this._asoNumInt,
      UrlRoute.BENEFICIARIOS_ASOCIADO,
      UrlRoute.NUEVO_BENEFICIARIO
    ]);
  }

  eliminarBeneficiarios(itemBeneficiario) {
    const dataModal = {
      tipo: 'delete',
      status: 'danger',
      icon: 'icon-alert-triangle',
      titulo: '',
      descripcion:
        'Todos los beneficiarios deben tener porcentaje y la sumatoria debe ser 100%',
      btnIcon: 'icon-cross',
      btnColor: 'btn--red1',
      btnNombre: 'Eliminar'
    };
  }

  modificarPorcentaje(idNumber) {
    const dataModal = {
      tipo: 'agregar',
      status: 'success',
      icon: 'icon-thumbs-up',
      titulo: '',
      descripcion: '¡Se han guardado los cambios de manera exitosa!',
      btnIcon: 'icon-checkmark',
      btnColor: 'btn--green1',
      btnNombre: 'Aceptar'
    };
  }

  _guardarDatosPorcentaje(datos) {

    const config = this.configuracion.beneficiariosPorcejate;
    if (datos && datos.length) {
      this._datoEliminar.beneficiariosRelacionados = [];
      datos.forEach(x =>
        this._datoEliminar.beneficiariosRelacionados.push({
          porcentajeBen: x[config.keyPorcentaje],
          benCod: x.codBeneficiario,
          tipoCod: x.tipoCod, borrar: false
        })
      );

      this._datoEliminar.beneficiariosRelacionados.push({
        porcentajeBen: -1,
        benCod: this._datoEliminar.codigoBeneficiario,
        tipoCod: this._datoEliminar.tipoBen,
        borrar: true
      });
      this._datoEliminar.codigoBeneficiario = null;

    }

    this.eliminarBeneficiario(this._datoEliminar);
  }

  exportarPdf() {
    const parameters: any = {};
    const datasource: any[] = [];
    const reporteParametros: ReportParams = new ReportParams;

    parameters.nomAso = this.datosAsociado.nomCli;
    parameters.nitCli = this.datosAsociado.nitCli;

    this.listaBeneficiarios
      .filter(item => item.benDesCorEstTipBen === 'R' || item.benDesCorEstTipBen === 'A')
      .forEach(item => {
        const beneficiario: any = {};
        beneficiario.benDesCorTipIden = item.benDesCorTipIden;
        beneficiario.benNumIdentificacion = String(item.benNumIdentificacion);
        beneficiario.nomBeneficiario = `${item.nomBeneficiario} ${item.benApellido1} ${item.benApellido2}`;
        beneficiario.benDesParentesco = item.benDesParentesco;
        beneficiario.benFecNac = item.benFecNac;
        beneficiario.benEdad = DateUtil.calcularEdad(DateUtil.stringToDate(item.benFecNac));
        beneficiario.benPorcentaje = String(item.benPorcentaje === undefined || item.benPorcentaje === 0 ? '' : item.benPorcentaje);
        beneficiario.benDesInvalido = item.benDesInvalido;
        beneficiario.benDesEstTipBen = item.benDesEstTipBen;
        beneficiario.benDesTip = item.benDesTip;
        beneficiario.benDesSexo = item.benDesSexo;
        beneficiario.benFecReg = item.benFecReg;

        datasource.push(beneficiario);
      });

    reporteParametros.datasource = datasource;
    reporteParametros.parameters = parameters;

    this.usuario = this.frontService.authentication.getUser();
    if (this.usuario) {
      const logTransaccional = {
        usuario: this.usuario.username,
        usuarioNroIdentificacion: this.usuario.identification,
        usuarioNombre: this.usuario.name,
        usuarioCargo: this.usuario.title.description,
        regional: this.usuario.regional.description,
        zona: this.usuario.zone.description,
        nombreFuncionalidad: SIP_LOG_TRANSACCIONAL.Generar_datos_beneficiario_pdf.funcionalidad,
        accion: SIP_LOG_TRANSACCIONAL.Generar_datos_beneficiario_pdf.accion,
        ruta: SIP_LOG_TRANSACCIONAL.Generar_datos_beneficiario_pdf.ruta,
        consultaNombre: this.datosAsociado.nomCli,
        consultaIdentificacion: this.datosAsociado.nitCli
      };
      if (environment.production === true) {
        this.backService.consultasTransaccional.guardarLogTransaccional(logTransaccional).subscribe();
      }
    }

    this.backService.utilidades.generarJasper('pdf', 'beneficiarios', reporteParametros).subscribe(respuesta => {
      const body: any = respuesta.body;
      FileUtils.downloadPdfFile(body, 'beneficiarios');
    }, err => { this.frontService.alert.error(err.error.message); });
  }

  tienePermisos(permiso: string) {
    return this.frontService.scope.tienePermisos(permiso, this.menuConsultaAsocBeneficiarios ?
      this.menuConsultaAsocBeneficiarios.appObject.operations : []);
  }


}
