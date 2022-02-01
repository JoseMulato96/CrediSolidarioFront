import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormComponent } from '@core/guards';
import { BackFacadeService, FrontFacadeService } from '@core/services';
import { AppState } from '@core/store/reducers';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Page } from '@shared/interfaces/page.interface';
import { UrlRoute } from '@shared/static/urls/url-route';
import { FormValidate } from '@shared/util';
import { DateUtil } from '@shared/util/date.util';
import { from, Subscription } from 'rxjs';
import { Estado } from '../../../model/guardar-plan-cobertura-orden.model';
import { GuardarPlanCobertura } from '../../../model/guardar-plan-cobertura.model';
import { PostValorCuotaAction } from '../../../plan-cobertura.actions';
import { obtenerSeccionPorId } from '../../../plan-cobertura.reducer';
import { ValorCuotaConfig } from './valor-cuota.config';

@Component({
    selector: 'app-valor-cuota',
    templateUrl: './valor-cuota.component.html',
})
export class ValorCuotaComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {

    // Variables
    id = 'valorCuota';
    configuracion: ValorCuotaConfig = new ValorCuotaConfig();
    planCobertura: GuardarPlanCobertura;
    form: FormGroup;
    isForm: Promise<any>;
    _esCreacion: boolean;
    _subs: Subscription[] = [];
    crear: boolean;
    editar: boolean;
    mostrarGuardar: boolean;
    tiposValorCuota: any[];
    estado = true;
    dropdown: boolean;
    rowValorCuota: any;

    nombrePlan: any;
    nombreCobertura: any;

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly formBuilder: FormBuilder,
        private readonly store: Store<AppState>,
        private readonly translate: TranslateService,
        private readonly frontService: FrontFacadeService,
        private readonly backService: BackFacadeService
    ) {
        super();
    }

    ngOnDestroy(): void {
        this._subs.forEach(sub => sub.unsubscribe());
    }

    hasChanges() {
        return this.form && this.form.dirty;
    }

    ngOnInit(): void {
        // Realizamos el llamado al backend para listar por primera vez.
        this._subs.push(this.activatedRoute.params.subscribe((params: any) => {
            const codigoPlanCobertura = params.codigoCobertura === UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_PLANES_NUEVO ? null : params.codigoCobertura;
            if (codigoPlanCobertura) {
                this.listar(codigoPlanCobertura);
            }
        }));
        this._subs.push(this.store.select('planCoberturaUI')
            .subscribe(ui => {
                if (!ui || !ui.planCobertura) {
                    return;
                }
                this.planCobertura = ui;
                this.cargarDatosTabla(this.planCobertura.valorCuota);
            }));
    }


    private cargarDatosTabla(page: Page<any>) {
        if (!page || !page.content || page.content.length === 0) {
            return;
        }
        if (this.configuracion.gridConfig.component) {
            this.configuracion.gridConfig.component.limpiar();
            this.configuracion.gridConfig.component.cargarDatos(
                this.asignarEstados(page.content), {
                maxPaginas: page.totalPages,
                pagina: page.number,
                cantidadRegistros: page.totalElements
            });
        }
    }

    private asignarEstados(items: any) {
        const listObj = [];
        let item: any;
        for (item of items) {
            listObj.push({
                ...item,
                _estado: item.estado ? 'Si' : 'No',
            });
        }
        return listObj;
    }


    private initForm(param?: any) {
        this.isForm = Promise.resolve(
            this.form = this.formBuilder.group({
                codigo: new FormControl(param ? param.codigo : null, []),
                tipoValorCuota: new FormControl(param && param.mimTipoValorCuota ? this.obtenerTipoValorCuota(param.mimTipoValorCuota.codigo) : null, [Validators.required]),
                descripcion: new FormControl(param && param.mimTipoValorCuota ? this.obtenerFormulaTipoValorCuota(param.mimTipoValorCuota.codigo) : null),
                vigente: new FormControl(param ? param.estado : false),
                fechaInicioFechaFin: new FormControl(param ? this.rangoFechaSelected(param.fechaInicio, param.fechaFin) : null, [Validators.required])
            })
        );

        this.form.controls.descripcion.disable();
        if (this._esCreacion) {
            this.form.controls.vigente.disable();
            this.form.controls.vigente.setValue(true);
        }
        this.chagueValues();
    }

    chagueValues() {
        this.form.controls.tipoValorCuota.valueChanges.subscribe(tipoValorCuota => {
            this.form.controls.descripcion.setValue(tipoValorCuota.formula);
        });
    }

    private obtenerTipoValorCuota(codigo: any) {
        return this.tiposValorCuota.find(res => res.codigo === codigo);
    }

    private obtenerFormulaTipoValorCuota(codigo: any) {
        return this.tiposValorCuota.find(res => res.codigo === codigo)?.formula;
    }

    private rangoFechaSelected(fechaIni: any, fechaFin: any) {
        return [DateUtil.stringToDate(fechaIni), DateUtil.stringToDate(fechaFin)];
    }

    limpiarFormulario() {
        this.form.reset();
        this.initForm();
    }


    /**
     * Metodo encargado de cargar la info para el fromulario
     */
    private async cargarDatosDesplegables() {

        this.nombrePlan = this.planCobertura.planCobertura.mimPlan.nombre;
        this.nombreCobertura = this.planCobertura.planCobertura.mimCobertura.nombre;

        const _tipoValorCuota: any = await this.backService.tipoValorCuota.obtenerTiposValoresCuota({
            estado: true, sort: 'nombre,asc'
        }).toPromise().catch(err => this.frontService.alert.error(err.error.messagem));
        this.tiposValorCuota = _tipoValorCuota && _tipoValorCuota._embedded && _tipoValorCuota._embedded.mimTipoValorCuota.length > 0 ? _tipoValorCuota._embedded.mimTipoValorCuota : null;
    }


    /**
     * Metodo encargado de listar los registros de valores de cuota
     */
    private listar(codigoPlanCobertura: string, pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc', estado = 'true') {
        this.backService.valorCuotaPlanCobertura.getValoresCuotaPlanCobertura({
            'mimPlanCobertura.codigo': codigoPlanCobertura,
            estado: estado,
            page: pagina,
            size: tamanio,
            sort: sort,
            isPaged: true,
        }).subscribe((page: any) => {
            this.configuracion.gridConfig.component.limpiar();
            if (!page || !page.content || page.content.length === 0) {
                if (estado === 'true') {
                    this.store.dispatch(new PostValorCuotaAction(page, this.id, Estado.Pendiente));
                }
                return;
            }
            // Informamos que ya hay valores cuota al Redux para controlar el estado del componente.
            let estadoModulo = this.validarEstado(page.content) === undefined && (estado === 'false' || estado === '') ? Estado.Pendiente : Estado.Guardado;
            this.store.dispatch(new PostValorCuotaAction(page, this.id, estadoModulo));
        }, (err) => {
            this.frontService.alert.error(err.error.message);
        });
    }
    validarEstado(items: any) {
        return items.find(objec => objec.estado === true);
    }

    obtenerEstado(): string {
        if (!this.planCobertura) {
            return Estado.Pendiente;
        }

        const seccion = obtenerSeccionPorId(this.id, this.planCobertura.guardarPlanCoberturaOrden);
        return seccion ? seccion.estado : Estado.Pendiente;
    }

    onToggleStatus($event) {
        this.obtenerDatosConEstados($event, $event.currentTarget.checked);
    }

    obtenerDatosConEstados($event, estado: boolean) {
        this.estado = estado;
        this.listar(this.planCobertura.planCobertura.codigo, $event.pagina, $event.tamano, $event.sort, this.estado ? 'true' : '');
    }

    onSiguiente($event) {
        this.obtenerDatosConEstados($event, this.estado);
    }

    onAtras($event) {
        this.obtenerDatosConEstados($event, this.estado);
    }


    async toggle() {
        if (this.planCobertura) {
            this.dropdown = !this.dropdown;
        } else {
            this.translate.get('administracion.protecciones.planCobertura.datosPrincipales.alertas.guardar').subscribe((respuesta: string) => {
                this.frontService.alert.info(respuesta);
            });
        }
    }

    onClickCeldaElement($event) {
        if ($event.col.key === 'editar') {
            this.toggleGuardar(true, $event);
        } else {
            this.alEliminar($event.dato);
        }
    }


    async toggleGuardar(toggle: boolean, rowDesmembracionAcidente?: any) {
        if (!toggle && this.hasChanges()) {
            this.frontService.alert.confirm(this.translate.instant('global.onDeactivate')).then((respuesta: boolean) => {
                if (respuesta) {
                    this.mostrarGuardar = false;
                    this.limpiarFormulario();
                }
            });
        } else {
            // Intentamos cargar los datos de los desplegables solo cuando se abra el formulario.
            // Ademas, si ya estan inicializados, no lo hacemos de nuevo.
            if (toggle) {
                await this.cargarDatosDesplegables();
            }
            if (rowDesmembracionAcidente) {
                this.rowValorCuota = JSON.parse(JSON.stringify(rowDesmembracionAcidente.dato));
                this._esCreacion = false;
                this.editar = true;
                this.crear = false;
                this.initForm(this.rowValorCuota);
            } else {
                this.rowValorCuota = undefined;
                this._esCreacion = true;
                this.editar = false;
                this.crear = true;
                this.initForm();
            }

            this.mostrarGuardar = toggle;
        }
    }

    guardar() {
        if (this.form.invalid) {
            this.validateForm(this.form);
            this.translate.get('global.validateForm').subscribe((text: string) => {
                this.frontService.alert.warning(text);
            });
            return;
        }

        if (this._esCreacion) {
            this.crearData();
        } else {
            this.actualizar();
        }
    }

    private crearData() {
        const form: any = this.form.value;
        const datosForm = {
            mimPlanCobertura: { codigo: this.planCobertura.planCobertura.codigo },
            mimTipoValorCuota: { codigo: form.tipoValorCuota.codigo },
            estado: this.form.controls.vigente.value,
            fechaInicio: DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[0], 'dd-MM-yyyy'),
            fechaFin: DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[1], 'dd-MM-yyyy'),
        };

        this.backService.valorCuotaPlanCobertura.postValorCuotaPlanCobertura(datosForm).subscribe(() => {
            // cerramos modal
            this.rowValorCuota = undefined;
            this.mostrarGuardar = false;
            this.limpiarFormulario();

            this.translate.get('global.guardadoExitosoMensaje').subscribe((text: string) => {
                this.frontService.alert.success(text).then(() => {
                    // Recargamos la informacion de la tabla.
                    this.listar(this.planCobertura.planCobertura.codigo);
                });
            });
        }, (err) => {
            this.frontService.alert.error(err.error.message);
        });
    }


    private actualizar() {
        const form: any = this.form.getRawValue();
        this.rowValorCuota = {
            codigo: form.codigo,
            mimPlanCobertura: { codigo: this.planCobertura.planCobertura.codigo },
            mimTipoValorCuota: { codigo: this.form.controls.tipoValorCuota.value.codigo },
            estado: this.form.controls.vigente.value,
            fechaInicio: DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[0], 'dd-MM-yyyy'),
            fechaFin: DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[1], 'dd-MM-yyyy'),
        };
        this.backService.valorCuotaPlanCobertura.putValorCuotaPlanCobertura(this.planCobertura.planCobertura.codigo,
            this.rowValorCuota).subscribe((respuesta: any) => {

                // Cerramos el modal.
                this.rowValorCuota = undefined;
                this.mostrarGuardar = false;
                // Limpiamos el formulario.
                this.limpiarFormulario();

                this.translate.get('global.actualizacionExitosaMensaje').subscribe((text: string) => {
                    this.frontService.alert.success(text).then(() => {
                        // Recargamos la informacion de la tabla.
                        this.listar(this.planCobertura.planCobertura.codigo, 0, 10, 'fechaCreacion,desc', this.estado ? 'true' : '');

                    });
                });
            }, (err) => {
                this.frontService.alert.error(err.error.message);
            });

    }

    private alEliminar($event: any) {
        const codigoDesmembracionAccidente = $event.codigo;
        this.translate.get('administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.desmembracionAccidente.alertas.eliminar').subscribe((text: string) => {
            const modalPromise = this.frontService.alert.confirm(text, 'danger');
            const newObservable = from(modalPromise);
            newObservable.subscribe(
                (desition: any) => {
                    if (desition === true) {
                        this.backService.valorCuotaPlanCobertura.deleteValorCuotaPlanCobertura(codigoDesmembracionAccidente).subscribe((respuesta: any) => {
                            this.translate.get('global.eliminadoExitosoMensaje').subscribe((texto: string) => {
                                this.frontService.alert.success(texto).then(() => {
                                    // Recargamos la informacion de la tabla.
                                    this.listar(this.planCobertura.planCobertura.codigo);
                                });
                            });
                        });
                    }
                });
        });
    }
}
