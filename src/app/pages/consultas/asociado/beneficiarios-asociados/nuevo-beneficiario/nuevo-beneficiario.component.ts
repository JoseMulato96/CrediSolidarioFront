import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BackFacadeService } from '@core/services/back-facade.service';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { Acciones } from '@core/store/acciones';
import { DatosAsociadoWrapper } from '@core/store/asociado-data.service';
import { DataService } from '@core/store/data.service';
import { TranslateService } from '@ngx-translate/core';
import { DatosAsociado } from '@shared/models';
import { Beneficiario } from '@shared/models/beneficiario';
import { APP_PARAMETROS } from '@shared/static/constantes/app-parametros';
import { SERVICIOS_PARAMETROS } from '@shared/static/constantes/servicios-parametros';
import { SIP_PARAMETROS_TIPO } from '@shared/static/constantes/sip-parametros-tipo';
import { UrlRoute } from '@shared/static/urls/url-route';
import { FormValidate } from '@shared/util';
import { DateUtil } from '@shared/util/date.util';
import { masksPatterns } from '@shared/util/masks.util';
import { forkJoin, Subscription } from 'rxjs';
import { EventoAsociadosService } from '../../services/evento-asociados.service';
import { NuevoBeneficiarioConfig } from './nuevo-beneficiario.config';

@Component({
  selector: 'app-nuevo-beneficiario',
  templateUrl: './nuevo-beneficiario.component.html',
  styleUrls: ['nuevo-beneficiario.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NuevoBeneficiarioComponent extends FormValidate implements OnInit, OnDestroy {
  form: FormGroup;
  isForm: Promise<any>;
  activeBeneficiario: string;
  activeSexo: string;
  formBeneficiario: any;
  idBeneficiario: any;
  _codigoBeneficiarioAsociado: any;
  tipoCod: any;
  _tituloForm = '';
  _maxDate: Date = new Date();

  _valorSolidaridad = '1';
  _valorAuxFun = '2';
  _valorOtros = '3';
  _valorSexoNN = '3';
  _valorSexoF = '2';
  _valorSexoM = '1';

  subscription: Subscription[] = [];
  datosAsociado: DatosAsociado;
  _asoNumInt: any;
  patterns = masksPatterns;
  _agrupado: any[] = [];
  _elementosTipoBeneficiario: any[] = [];
  _elementosTipoIdentificacion: any[] = [];

  _editar = false;
  _disablePlanEducativo = false;

  _tipoBeneficiario: string;
  _codigoProteccion: string;
  _agregarEducativo = false;
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description obtiene los tipo de paramentros de la vista
   */
  parametrosVista = APP_PARAMETROS.BENEFICIARIO_NUEVO;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly translate: TranslateService,
    private readonly dataService: DataService,
    private readonly eventoAsociado: EventoAsociadosService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    super();
  }

  configuracion: NuevoBeneficiarioConfig = new NuevoBeneficiarioConfig();

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      this._tipoBeneficiario = params.tipoBen;
      this._codigoProteccion = params.codigoProt;
      if (this._tipoBeneficiario && this._codigoProteccion) {
        this._agregarEducativo = true;
      }

    });

    this.subscription.push(
      this.route.params.subscribe(params => {
        this.idBeneficiario = params['idBeneficiario'];
        this.tipoCod = params['tipoCod'];

        if (this.idBeneficiario) {
          this._editar = true;
          this.translate
            .get('asociado.beneficiario.nuevoBeneficiario.editartTitulo')
            .subscribe(text => {
              this._tituloForm = text;
            });
        } else {
          this.translate
            .get('asociado.beneficiario.nuevoBeneficiario.agregarTitulo')
            .subscribe(text => {
              this._tituloForm = text;
            });
        }
      })
    );

    this.subscription.push(
      this.route.parent.params.subscribe(params => {
        this._asoNumInt = params['asoNumInt'];
        if (!this._asoNumInt) {
          return;
        }

        this.subscription.push(
          this.dataService
            .asociados()
            .asociado.subscribe((respuesta: DatosAsociadoWrapper) => {
              if (
                !respuesta ||
                respuesta.datosAsociado.numInt !== this._asoNumInt
              ) {
                this._publicarDatosAsociado();
                return;
              }

              this.datosAsociado = respuesta.datosAsociado;
            })
        );
      })
    );

    this.eventoAsociado.summenu().next({ mostrar: true });

    this.obtenerDatosConfiguracion();
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Obtener el beneficiario para editar
   */
  getBeneficiario() {
    this.backService.beneficiario
      .getBeneficiario(this.idBeneficiario)
      .subscribe((resultado: any) => {
        this.validarSexo(resultado.benSexo);

        const resTipoId = this.configuracion.tipoIdentificaciones.find(
          x => x.sipParametrosPK.codigo === resultado.benTipoIdentificacion
        );

        resultado.sipBeneficiariosAsociadoList = resultado.sipBeneficiariosAsociadoList || [];

        const item = resultado.sipBeneficiariosAsociadoList.find(items => {
          return (this._asoNumInt && this._asoNumInt === items.asoNumInt &&
            items.tipoCod === this.tipoCod &&
            (items.estadoBeneficiario === SIP_PARAMETROS_TIPO.TIPO_ESTADOS_BENEFICIARIOS.SIP_PARAMETROS.ACTIVO ||
              (items.estadoBeneficiario === SIP_PARAMETROS_TIPO.TIPO_ESTADOS_BENEFICIARIOS.SIP_PARAMETROS.REPETIDO &&
                items.tipoCod === APP_PARAMETROS.BENEFICIARIO_NUEVO.TIPO_BENEFICIARIO.FAMILIAR_DIRECTO)) &&
            items.estado === SIP_PARAMETROS_TIPO.TIPO_ESTADOS_REGISTRO_DEL_BENEFICIARIOS.SIP_PARAMETROS.ACTIVO);
        });

        if (!item) {
          this.frontService.alert.error('El beneficiario no tiene los estados para actualizar');
          return;
        }


        const tipoben = this._elementosTipoBeneficiario.find(
          x => x.tipoCod === this.tipoCod
        );

        const resParentesco = this.configuracion.tiposParentescos.find(
          x => x.sipParametrosPK.codigo === + item.parentesco
        );

        this._disablePlanEducativo = false;

        let valor, planEducativo, tipoBen;
        if (
          this.parametrosVista.FILTRO_TIPO_BENEFICIARIO.SOLIDARIDAD.includes(
            tipoben.nombreCorto
          )
        ) {
          valor = this._valorSolidaridad;
        }
        if (
          this.parametrosVista.FILTRO_TIPO_BENEFICIARIO.AUXILIO_FUNERARIO.includes(
            tipoben.nombreCorto
          )
        ) {
          valor = this._valorAuxFun;
        }
        if (this.parametrosVista.FILTRO_TIPO_BENEFICIARIO.OTROS.includes(tipoben.nombreCorto)) {
          tipoBen = this.form.controls.tipoBeneficiario.value;
          valor = this._valorOtros;
          if (item.proCod) {
            //// se muestra el component pero por la variable _disablePlanEducativo se coloca disable
            this.form.controls.planEducativo.enable();
            this._disablePlanEducativo = true;
            planEducativo = this.configuracion.planEducativo.find(x => item.proCod.proCod = x.proCod);
          }
        }
        this._editar = true;
        this._codigoBeneficiarioAsociado = item.codigo;
        this.form.patchValue({
          nombre: resultado.benNombres,
          apellido1: resultado.benApellido1,
          apellido2: resultado.benApellido2,
          numeroId: resultado.benIdentificacion,
          fechaNacimiento: new Date(resultado.benFechaNac),
          edad: resultado.benEdad,
          sexo: resultado.benSexo,
          invalido: resultado.benInvalido === '1',
          identificacion: resTipoId,
          porcentaje: item.porcentaje,
          observaciones: item.observaciones || '',
          tipoBeneficiario: tipoben,
          beneficiario: valor,
          parentesco: resParentesco,
          planEducativo: planEducativo
        });
        this.validarApellido(resParentesco.sipParametrosPK.codigo);
        this.validarSexo(resultado.benSexo);
        this.cambiarFiltroBeneficiario(valor);
        this.presentarCmpPorcentajeYSMMLV(valor, tipoben);
        this._onChangeTipoBeneficiario(tipoben);
        this.activeBeneficiario = valor;
        this.form.controls.tipoBeneficiario.disable();
        this._calcularEdad(new Date(resultado.benFechaNac));
      });
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description elimina las subcripciones
   */
  ngOnDelete() {
    this.subscription.forEach(x => x.unsubscribe());
    this.subscription = undefined;
  }

  ngOnDestroy() {
    this.subscription.forEach(x => x.unsubscribe());
    this.subscription = undefined;
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description obtiene los datos para llenar en los componentes
   */
  obtenerDatosConfiguracion() {
    this.configuracion.tiposBeneficiarios = [];
    this._elementosTipoBeneficiario = [];
    this.configuracion.tipoIdentificaciones = [];

    forkJoin([
      this.backService.beneficiario.getTiposBeneficiarios(),
      this.backService.parametro.getParametrosTipo(
        SIP_PARAMETROS_TIPO.TIPOS_IDENTIFICACION.TIP_COD
      ),
      this.backService.parametro.getParametrosTipo(SIP_PARAMETROS_TIPO.TIPOS_PARENTESCO.TIP_COD),
      this.backService.parametro.getParametrosTipo(SIP_PARAMETROS_TIPO.CANAL_VENTA.TIP_COD),
      this.backService.beneficiario.getPlanEducativo(this._asoNumInt),
      this.backService.parametro.getParametrosTipo(SIP_PARAMETROS_TIPO.PROMOTORES.TIP_COD)
    ]).subscribe(
      ([
        resTipoBeneficiario,
        resTipoIdentificacion,
        resTipoParentesco,
        resTipoCanalVenta,
        resPlanEducativo,
        resPromotores
      ]) => {
        this._elementosTipoBeneficiario = resTipoBeneficiario as any[];
        this._elementosTipoIdentificacion = resTipoIdentificacion as any[];
        this.configuracion.tipoIdentificaciones =
          resTipoIdentificacion.sipParametrosList;
        this.configuracion.tiposParentescos =
          resTipoParentesco.sipParametrosList;
        this.configuracion.tiposCanalVenta =
          resTipoCanalVenta.sipParametrosList;
        this.configuracion.planEducativo = this.getDatosResPlanEducativo(
          resPlanEducativo as any[]
        );

        const codigos: string[] = [];
        resPromotores.sipParametrosList.forEach(x => {
          codigos.push(x.sipParametrosPK.codigo);
        });

        this.backService.beneficiario.getPromotores(codigos).subscribe(respuesta => {
          this.configuracion.tipoPromotor = respuesta.content;
        });

        this.iniciarDatosForm();
        this._onChangeSolidaridad();
        this._onChangeEducativo();
      }
    );
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description del valor obtenido de la respuesta del servicio organiza los datos anidados en un solo array de datos
   */
  private getDatosResPlanEducativo(resPlanEducativo: any[]) {
    const resultado: any[] = [];

    resPlanEducativo.forEach(x => {
      const dato: any = {};
      dato.proCod = x.proCod;
      dato.prodDescripcion = x.sipProductos.prodDescripcion;
      dato.tipoCod = x.sipProductos.tipoCod;
      resultado.push(dato);
    });

    return resultado;
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description si cambia de tipo de solaridad se habilita y se desabilita componentes dependiendo del valor y resetea los valores de tipo de beneficiario
   */
  _onChangeSolidaridad() {
    const valor = this.form.get('beneficiario').value || this._valorSolidaridad;
    const tipo = this.form.get('identificacion').value;
    const id = this.form.get('numeroId').value;

    const tipoBen = this.form.controls.tipoBeneficiario.value;

    this.limpiarCampos();
    this.toogleCheckboxTipoBeneficiario(valor);
    this.presentarCmpPorcentajeYSMMLV(valor, tipoBen);
    this.form.get('beneficiario').setValue(valor);
    this.cambiarFiltroBeneficiario(valor);

    if (valor === '2') {
      return new Promise(success => {
        this.backService.beneficiario
          .getBeneficiarioPorId(id, tipo.sipParametrosPK.codigo)
          .subscribe(
            (respuesta: any) => {

              if (
                respuesta &&
                respuesta.sipBeneficiariosAsociadoRepetidosList &&
                respuesta.sipBeneficiariosAsociadoRepetidosList.length
                // Mostrar solo si selecciono Auxilio funerario
              ) {
                this.configuracion.beneficiariosExistentes.component.cargarDatos(
                  respuesta.sipBeneficiariosAsociadoRepetidosList
                );
                this.configuracion.beneficiariosExistentes.identificacion = this.form.get(
                  'numeroId'
                ).value;
                this.configuracion.beneficiariosExistentes.nombre = this.form.get(
                  'nombre'
                ).value.trim().concat(this.form.get('apellido1').value ? ' ' + this.form.get('apellido1').value.trim() : '')
                  .concat(this.form.get('apellido2').value ? ' ' + this.form.get('apellido2').value.trim() : '')
                  ;
                this.configuracion.winNormal.component.mostrar();
              }
            },
            error => {
              success(false);
              if (error.status === 500) {
                this.form.get('numeroId').setValue('');
                this.frontService.alert.warning(error.error.message);
              }
              if (error.status === 404) {
                if (this._agregarEducativo) {
                  this._onChangeEducativo();
                }
              }
              if (error.status === 400) {
                this.form.get('numeroId').setValue('');
                this.frontService.alert.warning(error.error.message);
              }
            }

          );

        success(false);
      });
    }

  }

  _onChangeEducativo() {
    if (this._agregarEducativo) {

      const tipoBen = this.form.controls.tipoBeneficiario.value;
      const valor = this._valorOtros;
      this.toogleCheckboxTipoBeneficiario(valor);
      this.form.controls.planEducativo.disable();
      this.form.controls.tipoBeneficiario.disable();
      const tipoben = this._elementosTipoBeneficiario.find(x => x.tipoCod === this._tipoBeneficiario);
      const planEducativo = this.configuracion.planEducativo.find(x => this._codigoProteccion = x.proCod);
      this.form.patchValue({
        tipoBeneficiario: tipoben,
        planEducativo: planEducativo
      });
      this.presentarCmpPorcentajeYSMMLV(valor, tipoBen);
      this.form.get('beneficiario').setValue(valor);

      this.cambiarFiltroBeneficiario(valor);

    }

  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description cambia el tipo de beneficiario
   */
  _onChangeTipoBeneficiario(valor) {
    this.habilitarCamposBeneficiario(valor.tipoCod);
    this.validarPlanEducativo();
    if (this.parametrosVista.FILTRO_TIPO_BENEFICIARIO.AUXILIO_FUNERARIO.includes(
      valor.nombreCorto) && [
        this.parametrosVista.TIPO_BENEFICIARIO.FAMILIAR_DIRECTO,
        this.parametrosVista.TIPO_BENEFICIARIO.ADICIONAL
      ].includes(valor.tipoCod)) {
      this.obtenerCobertura(valor.tipoCod);
    }
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description escucha el cambio del parentesco
   */
  _onChangeParentesco(valor) {
    this.validarPlanEducativo();
    this.validarSexo(valor.sipParametrosPK.codigo);
    this.validarApellido(valor.sipParametrosPK.codigo);
  }

  obtenerCobertura(codTipBen) {
    this.backService.beneficiario.buscarCobertura(this._asoNumInt, codTipBen)
      .subscribe(respuesta => {
        this.form.controls.cobertura.setValue(respuesta);
      }, (error => {
        if (error.status === 404) {
          this.form.controls.cuota.setValue(0);
        }
      }));
  }

  /**
  * @author Jorge Luis Caviedes Alvarado
  * @description valida si se habilita los campos de apellido
  */
  validarApellido(codigo: any) {
    this.form.controls.apellido1.enable();
    this.form.controls.apellido2.enable();
    if (codigo === this.parametrosVista.PARENTESCO.JURIDICO.value) {
      this.form.controls.apellido1.setValue('');
      this.form.controls.apellido2.setValue('');
      this.form.controls.apellido1.disable();
      this.form.controls.apellido2.disable();
    }
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description valida si el entidad juridica para hacerle disable
   */
  validarSexo(valor) {
    this.form.controls.sexo.enable();
    const tipo = this.form.get('identificacion').value;
    if (valor === this.parametrosVista.PARENTESCO.JURIDICO.value || (tipo && tipo.sipParametrosPK.codigo === this.parametrosVista.TIPO_IDENTIFICACION.NIT)) {
      this.form.controls.sexo.disable();
      this.form.controls.sexo.setValue(this._valorSexoNN);

      this.toogleCheckboxSexoBeneficiario(this._valorSexoNN);
    }
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description habilita o desabilita los campos de beneficiarios de pendiendo del valor
   */
  habilitarCamposBeneficiario(valor: any) {
    this.form.controls.tipoPromotor.disable();
    this.form.controls.planEducativo.disable();
    this.form.controls.tipoCanalVenta.disable();
    if (this.parametrosVista.TIPO_BENEFICIARIO.ADICIONAL === valor) {
      this.form.controls.tipoPromotor.enable();
      this.form.controls.tipoCanalVenta.enable();
    } else if (
      [
        this.parametrosVista.TIPO_BENEFICIARIO.PE,
        this.parametrosVista.TIPO_BENEFICIARIO.BS
      ].includes(valor)
    ) {
      if (!this.configuracion.planEducativo.length) {
        this.translate
          .get('asociado.beneficiario.nuevoBeneficiario.alertNoPlanEducativo')
          .subscribe(text => {
            this.frontService.alert.warning(text);
          });
      }
      this.form.controls.planEducativo.enable();
      this.form.controls.porcentaje.setValue(100);
    }
  }

  validarPlanEducativo() {
    const tipoBeneficiario: any = this.form.get('tipoBeneficiario').value;
    const parentesco: any = this.form.get('parentesco').value;

    if (
      tipoBeneficiario && parentesco && tipoBeneficiario.tipoCod ===
      this.parametrosVista.TIPO_BENEFICIARIO.FAMILIAR_DIRECTO &&
      [
        this.parametrosVista.PARENTESCO.JURIDICO,
        this.parametrosVista.PARENTESCO.HIJO,
        this.parametrosVista.PARENTESCO.HIJA,
        this.parametrosVista.PARENTESCO.HIJASTRO,
        this.parametrosVista.PARENTESCO.NIETO,
        this.parametrosVista.PARENTESCO.HERMANO,
        this.parametrosVista.PARENTESCO.SOBRINO
      ].includes(parentesco.sipParametrosPK.codigo)
    ) {
      return false;
    }

    return true;
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description limpia los campos
   */
  limpiarCampos() {
    this.form.controls.tipoPromotor.disable();
    this.form.controls.planEducativo.disable();
    this.form.controls.tipoCanalVenta.disable();
    this.form.controls.cobertura.disable();
    this.form.controls.cuota.disable();
    this.form.controls.porcentaje.disable();

    this.form.controls.tipoBeneficiario.setValue('');
    this.form.controls.tipoPromotor.setValue('');
    this.form.controls.planEducativo.setValue('');
    this.form.controls.tipoCanalVenta.setValue('');
    this.form.controls.cobertura.setValue('');
    this.form.controls.cuota.setValue('');
    this.form.controls.porcentaje.setValue('');

  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description muestra y oculta componente de Salario minimo o Porcentaje
   */
  private presentarCmpPorcentajeYSMMLV(valor: string, tipoben: any) {
    if (valor === this._valorAuxFun) {
      this.form.controls.cobertura.enable();
      this.form.controls.cuota.enable();
      this.form.controls.porcentaje.disable();
      if (this._editar) {
        this.form.controls.cuota.enable();
        this.obtenerCobertura(tipoben.tipoCod);
      }

    } else {
      this.form.controls.cobertura.disable();
      this.form.controls.cuota.disable();
      this.form.controls.porcentaje.enable();
    }
  }

  /**
  * @author Jorge Luis Caviedes Alvarado
  * @description escucha cuando preciona un numero y este no es multiplo de 0.5
  * @return
  */
  _OnKeyPressCobertura(e) {

    const value = e.target.value;

    if (value % 0.5 !== 0) {
      this.form.controls.cuota.setValue((parseFloat(value || 0)).toFixed(0) + '.');
    }
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description cambia los valores del filtro de tipo de beneficiario
   */
  private cambiarFiltroBeneficiario(valor: string) {
    let filtros = [];
    if (valor === this._valorAuxFun) {
      filtros = this.parametrosVista.FILTRO_TIPO_BENEFICIARIO.AUXILIO_FUNERARIO;
    } else if (valor === this._valorOtros) {
      filtros = this.parametrosVista.FILTRO_TIPO_BENEFICIARIO.OTROS;
    } else if (valor === this._valorSolidaridad) {
      filtros = this.parametrosVista.FILTRO_TIPO_BENEFICIARIO.SOLIDARIDAD;
    }

    this.configuracion.tiposBeneficiarios = this._elementosTipoBeneficiario.filter(
      x => filtros.includes(x.nombreCorto)
    );
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description crea el formulario, agrega valores y realiza los cambios por defecto
   */
  private iniciarDatosForm() {
    this.creacionForm();
    // tslint:disable-next-line:no-unused-expression
    this.isForm && this.isForm.then(x => this.valoresDefault());
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description crea la configuracion de formulario
   */
  private creacionForm(valores?: any) {
    this.isForm = Promise.resolve(
      (this.form = this.formBuilder.group({
        beneficiario: new FormControl(null, [Validators.required]),
        tipoBeneficiario: new FormControl(null, [Validators.required]),
        tipoPromotor: new FormControl({ value: '', disabled: true }, [
          Validators.required
        ]),
        tipoCanalVenta: new FormControl({ value: '', disabled: true }, [
          Validators.required
        ]),
        planEducativo: new FormControl({ value: '', disabled: true }, [
          Validators.required
        ]),
        identificacion: new FormControl(null, [Validators.required]),
        edad: new FormControl(null, [Validators.required]),
        fechaNacimiento: new FormControl(null, [Validators.required]),
        numeroId: new FormControl(null, [Validators.required]),
        nombre: new FormControl(null, [Validators.required]),
        apellido1: new FormControl(null, [Validators.required]),
        apellido2: new FormControl(null, []),
        parentesco: new FormControl(null, [Validators.required]),
        sexo: new FormControl(null, [Validators.required]),
        invalido: new FormControl(null, [Validators.required]),
        porcentaje: new FormControl(null, [Validators.required]),
        cuota: new FormControl(null, []),
        cobertura: new FormControl(null, []),
        observaciones: new FormControl(null, [])
      }))
    );

    if (valores) {
      this.form.patchValue(valores);
    }

    /// valida que si es modo editar no pemite cambiar el beneficiario
    // tslint:disable-next-line:no-unused-expression
    (this._editar || this._agregarEducativo) && this.form.controls.beneficiario.disable();
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description agrega el valor por defecto
   */
  valoresDefault() {
    if (this.idBeneficiario) {
      this.getBeneficiario();
    }
    const vdefault: any = {
      invalido: false
    };

    this.form.patchValue(vdefault);
    this.activeBeneficiario = this._agregarEducativo ? this._valorOtros : this._valorSolidaridad;
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description preparacion para guardar los datos
   */
  async formBeneficiarioAsociados() {
    if (!this.validateComponents()) {
      return;
    }

    if (this._editar) {
      this.actualizar();
    } else {
      this.guardar();
    }
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description seleciona el check componente de Tipo Beneficiario
   */
  toogleCheckboxTipoBeneficiario(index: string) {
    // tslint:disable-next-line:no-unused-expression
    (!this._editar && !this._agregarEducativo) && (this.activeBeneficiario = index);
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description seleciona el check componente de Sexo
   */
  toogleCheckboxSexoBeneficiario(index: string) {
    this.activeSexo = index;
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description valida que los datos este completo y dilegenciados
   */
  validateComponents() {
    if (this.form.invalid) {
      this.validateForm(this.form);

      this.validarCamposForm();
      this.translate
        .get('global.validateForm')
        .subscribe(text => this.frontService.alert.warning(text));
      return false;
    }

    if (
      this.form.get('porcentaje').enabled &&
      !this.form.get('porcentaje').value
    ) {
      this.form.controls.porcentaje.setErrors({ incorrect: true });
      this.translate
        .get('global.validateForm')
        .subscribe(text => this.frontService.alert.warning(text));
      return false;
    }

    if (!this.validarCamposForm()) {
      this.translate
        .get('global.validateForm')
        .subscribe(text => this.frontService.alert.warning(text));
      return false;
    }


    const fechaNacimiento = this.form.get('fechaNacimiento').value;
    const parentesco = this.form.get('parentesco').value;
    const apellido1 = this.form.get('apellido1').value;
    const apellido2 = this.form.get('apellido2').value;

    /// Entonces el sistema valida el valor de la  cobertura sea un mulltiplo de 0,5.
    if (!this.validarValorMultipleCobertura()) {
      this.translate
        .get('asociado.beneficiario.nuevoBeneficiario.alertMultiplo')
        .subscribe(text => this.frontService.alert.warning(text));
      return false;
    }

    /// se valida que la fecha de nacimiento no sea mayor a la de hoy
    if (fechaNacimiento > new Date()) {
      this.translate
        .get('asociado.beneficiario.nuevoBeneficiario.alertFechaMayorHoy')
        .subscribe(text => this.frontService.alert.warning(text));
      return false;
    } else if (
      [
        this.parametrosVista.PARENTESCO.MADRE.value,
        this.parametrosVista.PARENTESCO.PADRE.value
      ].includes(parentesco.sipParametrosPK.codigo) &&
      fechaNacimiento >= new Date(this.datosAsociado.fecNac)
    ) {
      this.translate
        .get('asociado.beneficiario.nuevoBeneficiario.alertFechaMayorPadre')
        .subscribe(text => this.frontService.alert.warning(text));
      return false;
    } else if (
      [
        this.parametrosVista.PARENTESCO.HIJA.value,
        this.parametrosVista.PARENTESCO.HIJO.value
      ].includes(parentesco.sipParametrosPK.codigo) &&
      fechaNacimiento <= new Date(this.datosAsociado.fecNac)
    ) {
      this.translate
        .get('asociado.beneficiario.nuevoBeneficiario.alertFechaMayorHijo')
        .subscribe(text => this.frontService.alert.warning(text));
      return false;
    } else if (
      // this.parametrosVista.TIPO_BENEFICIARIO.FAMILIAR_DIRECTO ==
      //   tipoBeneficiario.tipoCod &&
      [
        this.parametrosVista.PARENTESCO.HIJA.value,
        this.parametrosVista.PARENTESCO.HIJO.value
      ].includes(parentesco.sipParametrosPK.codigo)
    ) {
      /* el sistema permite ingresar los nombres y los apellidos.
    Si el parentesco del beneficiario es hijo, se debe validar que uno de sus  apellidos sea igual al primer apellido del asociado
    */

      const result = [
        (apellido1 || '').trim().toLowerCase(),
        (apellido2 || '').trim().toLowerCase()
      ].find(x =>
        this.datosAsociado.nomCli
          .toLowerCase()
          .split(' ')
          .includes(x.toLowerCase())
      );
      if (!result) {
        this.translate
          .get('asociado.beneficiario.nuevoBeneficiario.alertExisteApellido')
          .subscribe(text => this.frontService.alert.warning(text));
        return false;
      }
    } else if (
      // this.parametrosVista.TIPO_BENEFICIARIO.FAMILIAR_DIRECTO ==
      //   tipoBeneficiario.tipoCod &&
      [
        this.parametrosVista.PARENTESCO.MADRE.value,
        this.parametrosVista.PARENTESCO.PADRE.value
      ].includes(parentesco.sipParametrosPK.codigo)
    ) {
      const result = [(apellido1 || '').trim().toLowerCase()].find(x =>
        this.datosAsociado.nomCli
          .toLowerCase()
          .split(' ')
          .includes(x.toLowerCase())
      );
      if (!result) {
        this.translate
          .get('asociado.beneficiario.nuevoBeneficiario.alertExisteApellido')
          .subscribe(text => this.frontService.alert.warning(text));
        return false;
      }
    }
    return true;
  }

  private validarValorMultipleCobertura() {
    if (this.form.controls.cobertura.enabled) {
      const valor = parseFloat(this.form.controls.cobertura.value || 0);
      const resultado = valor % 0.5;
      if (resultado !== 0) {
        return false;
      }
    }
    return true;
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description valida si tiene datos los siguientes datos plan educativo, promotor comercial, canal de venta
   * @return boolean
   */
  private validarCamposForm() {
    let valid = true;

    valid = this.validarCampoPorcentaje() && valid;
    valid = this.validarCampoSMMLV() && valid;
    valid = this.validarCampoCobertura() && valid;
    valid = this.validarCampoPlanEducativo() && valid;
    valid = this.validarCampoPromotor() && valid;
    valid = this.validarCampoCanalVenta() && valid;

    return valid;
  }

  private validarCampoPorcentaje() {
    if (
      this.form.get('porcentaje').enabled &&
      !this.form.get('porcentaje').value
    ) {

      this.form.controls.porcentaje.setErrors({ incorrect: true });
      return false;
    }
    return true;
  }

  private validarCampoSMMLV() {

    return true;
  }

  private validarCampoCobertura() {
    if (
      this.form.get('cobertura').enabled &&
      this.form.get('cobertura').value === undefined
    ) {

      //TODO:
    }
    return true;
  }

  private validarCampoPlanEducativo(): boolean {
    if (
      this.form.controls.planEducativo.enabled &&
      !this.form.controls.planEducativo.value
    ) {


      this.form.controls.planEducativo.setErrors({ incorrect: true });
      return false;
    }
    return true;
  }

  private validarCampoPromotor(): boolean {
    if (this.form.controls.tipoPromotor.enabled && !this.form.controls.tipoPromotor.value) {
      this.form.controls.tipoPromotor.setErrors({ incorrect: true });
      return false;
    }
    return true;
  }
  private validarCampoCanalVenta(): boolean {
    /*
     */
    if (
      this.form.controls.tipoCanalVenta.enabled &&
      !this.form.controls.tipoCanalVenta.value
    ) {


      this.form.controls.tipoCanalVenta.setErrors({ incorrect: true });
      return false;
    }
    return true;
  }

  /**
   * @author Jorge Luis Caviedes
   * @description Publicar datos de asociado.
   */
  _publicarDatosAsociado() {
    this.dataService
      .asociados()
      .accion(Acciones.Publicar, this._asoNumInt, true);
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description extrae los beneficiarios que esta relacionado
   */
  async _extraerBeneficiarios() {
    if (!this._agrupado.length) {
      await this.getBeneficiarios();
    }
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
   * @description abre el modal de porcentaje
   */
  async _openPorcentaje() {
    /// si la selecion del beneficiario es otros valor entonces el porcentaje es 100%
    if (
      this.form.get('beneficiario').value === this._valorOtros
    ) {
      return this.form.get('porcentaje').setValue(100);
    }

    const config = this.configuracion.beneficiariosPorcejate;

    const beneficiarios: any = await this._extraerBeneficiarios();



    if (!beneficiarios.length) {
      return this.form.get('porcentaje').setValue(100);
    } else if (this._editar && beneficiarios.length === 1) {
      return this.form.get('porcentaje').setValue(100);
    }

    /// se crea una copia del beneficiario que esta editando
    const beneficiario: any = JSON.parse(JSON.stringify(this.form.value));

    /// se crea una copia de los valores
    let datos: any[] = JSON.parse(JSON.stringify(beneficiarios));
    /// valida si es para editar
    if (this._editar) {
      /// se valida si el beneficiario existe se omite para poder colocar el porcentaje
      datos = datos.filter(x => x.codBeneficiario !== this.idBeneficiario);
    }

    /// se le agrega por defecto un valor
    beneficiario[config.keyPorcentaje] = String(beneficiario.porcentaje || 1);

    /// se coloca el nombre para que se muestre
    beneficiario[config.keyTitulo] = [beneficiario.nombre, beneficiario.apellido1, beneficiario.apellido2].join(' ');

    if (!(beneficiario.nombre || '').trim()) {
      this.translate
        .get('asociado.beneficiario.nuevoBeneficiario.alertNombre')
        .subscribe(text => {
          this.frontService.alert.warning(text);
        });
      this.form.get('nombre').setValue('');
      return false;
    }

    /// se le quita la opcion para que oculta el campo de borrado
    beneficiario._ocultar = true;

    /// se adiciona a los datos de porcentaje
    datos.unshift(beneficiario);

    /// se carga los datos
    config.component.cargarDatos(datos);
    this.configuracion.winPorcentaje.component.mostrar();
  }

  /**
  * @author Jorge Luis Caviedes Alvarado
  * @description filtar el campo parentesco, con el parametro string * pone todo
  */
  public filtarCampoParentesco(valor = '*') {
    if (valor === '*') {
      return this.configuracion.tipoIdentificaciones = JSON.parse(JSON.stringify(this._elementosTipoIdentificacion));
    }

    this.configuracion.tipoIdentificaciones = this._elementosTipoIdentificacion.filter(x => x.sipParametrosPK.codigo === valor);
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description valida los datos ID y Tipo del beneficiario si existe para completar si no esta fallecido
   */
  async _validacionIdentificacion(): Promise<boolean> {
    const tipo = this.form.get('identificacion').value;
    let id = this.form.get('numeroId').value;

    if (this._editar) {
      return false;
    }

    if (!id || !tipo || !this.datosAsociado) {
      return false;
    }
    id = String(id || '').trim();

    if (
      id === this.datosAsociado.nitCli &&
      this.datosAsociado.tipDoc === tipo.sipParametrosPK.codigo
    ) {
      this.translate
        .get('asociado.beneficiario.nuevoBeneficiario.alertCedulaIgual')
        .subscribe(text => this.frontService.alert.warning(text));
      return false;
    }
    return new Promise(success => {
      this.backService.beneficiario
        .getBeneficiarioPorId(id, tipo.sipParametrosPK.codigo)
        .subscribe(
          (respuesta: any) => {
            if (respuesta) {
              this._completarDatos(respuesta);
            }
          },
          error => {
            success(false);
            if (error.status === 500) {
              this.form.get('numeroId').setValue('');
              this.frontService.alert.warning(error.error.message);
            }
            if (error.status === 404) {

              this.form.patchValue({
                fechaNacimiento: '', edad: '', nombre: '', apellido1: '', apellido2: '', sexo: ''
              });
              this.creacionForm({
                identificacion: this.form.controls.identificacion.value, numeroId: this.form.controls.numeroId.value, invalido: false
              });

              if (this._agregarEducativo) {
                this._onChangeEducativo();
              }
            }
            if (error.status === 400) {
              this.form.get('numeroId').setValue('');
              this.frontService.alert.warning(error.error.message);
            }
          }

        );

      success(false);
    });
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description completa los datos en los campos con los parametros del beneficiario
   */
  _completarDatos(dato: Beneficiario) {
    const setDato: any = {};

    if (dato.benFechaNac) {
      setDato.fechaNacimiento = new Date(dato.benFechaNac);
      this._calcularEdad(setDato.fechaNacimiento);
    }

    if (dato.benNombres) {
      setDato.nombre = dato.benNombres;
    }

    if (dato.benApellido1) {
      setDato.apellido1 = dato.benApellido1;
    }

    if (dato.benApellido2) {
      setDato.apellido2 = dato.benApellido2;
    }

    if (dato.benSexo) {
      setDato.sexo = dato.benSexo;
      this.toogleCheckboxSexoBeneficiario(setDato.sexo);
    }

    this.form.patchValue(setDato);
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description calcula la edad del beneficiario
   */
  _calcularEdad(edad: Date) {
    this.form.get('edad').setValue(DateUtil.calcularEdad(edad));
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description se devuelve a la anterior vista
   */
  private irAtras() {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.CONSULTAS,
      UrlRoute.CONSULTAS_ASOCIADO,
      this._asoNumInt,
      UrlRoute.BENEFICIARIOS_ASOCIADO
    ]);
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description guarda los nuevos porcentajes editado
   */
  async _validarDatosPorcentaje(modificaciones: any[]) {

    const hayParaEliminar: boolean = modificaciones.findIndex(x => x._desabilitar) !== -1;


    if (hayParaEliminar) {
      this.translate
        .get('asociado.beneficiario.alertEliminar')
        .subscribe(text => {
          this.frontService.alert.confirm(text, 'danger').then(async afirmacion => {
            if (afirmacion) {
              return this._guardarDatosPorcentaje(modificaciones);
            }
          });
        });
    } else {
      this._guardarDatosPorcentaje(modificaciones);
    }
  }

  async _guardarDatosPorcentaje(modificaciones: any[]) {
    const keyP = this.configuracion.beneficiariosPorcejate.keyPorcentaje;
    const beneficiarios: any[] = await this._extraerBeneficiarios();
    /// cambiando los valores
    modificaciones.forEach(mod => {
      const benf = beneficiarios.find(
        y => mod.codBeneficiario === y.codBeneficiario
      );
      if (benf) {
        benf[keyP] = mod[keyP];
        benf._desabilitar = mod._desabilitar;
      } else {
        this.form.get('porcentaje').setValue(mod[keyP]);
      }
    });
    this.configuracion.winPorcentaje.component.ocultar();
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Obtener los beneficiario
   */
  async getBeneficiarios() {
    return new Promise((success, fail) => {
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
            return success(respuesta);
          }
          respuesta.forEach(x => {
            let element: any = this._agrupado.find(
              y => y.desGrupo === x.desGrupo
            );
            if (!element) {
              element = {
                desGrupo: x.desGrupo,
                valores: []
              };
              this._agrupado.push(element);
            }
            element.valores.push(x);
          });
          return success(respuesta);
        }
      );
    });
  }

  private async actualizar() {
    const form: any = this.form.getRawValue();
    const config = this.configuracion.beneficiariosPorcejate;

    const beneficiariosRelacionados: any[] = [];
    const beneficiarios = await this._extraerBeneficiarios();
    if (this._valorSolidaridad === this.form.controls.beneficiario.value) {
      beneficiarios.forEach(x => {
        const obj = {
          porcentajeBen: x[config.keyPorcentaje],
          benCod: x.codBeneficiario,
          tipoCod: x.tipoCod,
          borrar: x._desabilitar || false
        };
        if (obj.benCod !== this.idBeneficiario) {
          beneficiariosRelacionados.push(obj);
        }
      }
      );
    }
    let dato = {
      tipoIdBen: form.identificacion.sipParametrosPK.codigo,
      edadBen: form.edad,
      numIden: form.numeroId,
      nombreBen: form.nombre.toUpperCase(),
      apellido1Ben: (form.apellido1 || '').toUpperCase(),
      apellido2Ben: (form.apellido2 || '').toUpperCase(),
      codParentescoBen: form.parentesco.sipParametrosPK.codigo,
      codSexoBen: this.form.getRawValue().sexo,
      invalidoBen: form.invalido ? '1' : '2',
      tipoBen: this.tipoCod,
      fecNacBen: form.fechaNacimiento.getTime(),
      obserBen: form.observaciones,
      porcentajeBen: form.porcentaje,
      cuota: form.cuota,
      cobertura: form.cobertura,
      codigoProt: form.planEducativo ? form.planEducativo.proCod : null,
      beneficiariosRelacionados,
      codigoBeneficiarioAsociado: this._codigoBeneficiarioAsociado,
      codigoBeneficiario: this.idBeneficiario
    };

    dato = this.agregarDatosPromotorYVenta(dato, form);

    this.backService.beneficiario
      .actualizaBeneficiario(this._asoNumInt, dato)
      .subscribe(
        (resultado: any) => {
          this.frontService.alert.success(resultado.mensaje).then(() => this.irAtras());
        },
        error => {
          this.frontService.alert.error(error.error.message);
        }
      );
  }

  private async guardar() {
    const form: any = this.form.value;
    const config = this.configuracion.beneficiariosPorcejate;

    const beneficiariosRelacionados: any[] = [];
    const beneficiarios = await this._extraerBeneficiarios();
    if (this._valorSolidaridad === this.form.controls.beneficiario.value) {
      beneficiarios.forEach(x => {
        const obj = {
          porcentajeBen: x[config.keyPorcentaje],
          benCod: x.codBeneficiario,
          tipoCod: x.tipoCod,
          borrar: x._desabilitar || false
        };
        if (obj.benCod !== this.idBeneficiario) {
          beneficiariosRelacionados.push(obj);
        }
      }
      );
    }

    let dato = {
      tipoIdBen: form.identificacion.sipParametrosPK.codigo,
      edadBen: form.edad,
      numIden: form.numeroId,
      nombreBen: form.nombre.toUpperCase(),
      apellido1Ben: (form.apellido1 || '').toUpperCase(),
      apellido2Ben: (form.apellido2 || '').toUpperCase(),
      codParentescoBen: form.parentesco.sipParametrosPK.codigo,
      codSexoBen: this.form.getRawValue().sexo,
      invalidoBen: form.invalido ? '1' : '2',
      tipoBen: this._agregarEducativo ? this._tipoBeneficiario : form.tipoBeneficiario.tipoCod,
      fecNacBen: form.fechaNacimiento.getTime(),
      obserBen: form.observaciones,
      porcentajeBen: form.porcentaje,
      cuota: form.cuota,
      cobertura: form.cobertura,
      codigoProt: this._agregarEducativo ? this._codigoProteccion : form.planEducativo ? form.planEducativo.proCod : null,
      beneficiariosRelacionados
    };

    dato = this.agregarDatosPromotorYVenta(dato, form);
    this.backService.beneficiario
      .guardarBeneficiario(this._asoNumInt, dato)
      .subscribe(
        (resultado: any) => {
          this.frontService.alert.success(resultado.mensaje).then(() => {
            this.eventoAsociado.summenu().next({ mostrar: true });
            this.eventoAsociado.atras().next({ mostrar: false });
            this.irAtras();
          });

        },
        error => {
          this.frontService.alert.error(error.error.message);
        }
      );
  }

  _onAceptar() {
    this.configuracion.winNormal.component.ocultar();
  }

  private agregarDatosPromotorYVenta(datos: any = {}, form: any): any {
    if (form.beneficiario === this._valorAuxFun &&
      this.parametrosVista.TIPO_BENEFICIARIO.ADICIONAL === form.tipoBeneficiario.tipoCod) {
      datos.codigoPromotor = form.tipoPromotor.id;
      datos.codigoCanalVenta = form.tipoCanalVenta.sipParametrosPK.codigo;
    }
    return datos;
  }
  /// fin de la clase
}


