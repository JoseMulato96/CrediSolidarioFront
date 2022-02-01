import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { GestionDiariaConfig } from './gestion-diaria.config';
import { DateUtil } from '@shared/util/date.util';
import { TranslateService } from '@ngx-translate/core';
import { ObjectUtil } from '@shared/util/object.util';
import { FileUtils } from '@shared/util/file.util';
import { Observable } from 'rxjs';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-gestion-diaria',
  templateUrl: './gestion-diaria.component.html',
})
export class GestionDiariaComponent implements OnInit {
  configuracion: GestionDiariaConfig = new GestionDiariaConfig();
  form: FormGroup;
  isForm: Promise<any>;
  gestionDiaria: any;
  obs: Observable<any>;
  observacion: string;
  mostrarGuardar: boolean;
  habilitarBotonExportar: boolean;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
    ) { }

  ngOnInit(): void {
    this._initForm();
  }

  _initForm() {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        documentoColaborador: new FormControl(null),
        fechaInicioFin: new FormControl(null, [Validators.required])
      })
    );
  }

  async buscar(pagina = 0, tamanio = 10) {
    if (this.form.invalid) {
      this.translate.get('global.validateForm').subscribe((validateForm: string) => {
        this.frontService.alert.warning(validateForm);
      });
      return;
    }
    this.configuracion.gridConfig.component.limpiar();
    await this.getData(true, pagina, tamanio).then((item: any) => {

        this.configuracion.gridConfig.component.limpiar();

          if (!item || !item.content || item.content.length === 0) {
            this.gestionDiaria = null;
            this.habilitarBotonExportar = false;
            this.translate.get('global.noSeEncontraronRegistrosMensaje').subscribe((validateForm: string) => {
              this.frontService.alert.info(validateForm);
            });
            return;
          }
          this.habilitarBotonExportar = true;
          this.gestionDiaria = item.content;
          this.configuracion.gridConfig.component.cargarDatos(
            item.content, {
            maxPaginas: item.totalPages,
            pagina: item.number,
            cantidadRegistros: item.totalElements
          });
      }, err => {
        this.frontService.alert.warning(err.error.message);
      });
  }

  private async getData(isPaged?: boolean, pagina?: number, tamanio?: number) {

    const _form = this.form.getRawValue();
    const fechaInicio = _form.fechaInicioFin && DateUtil.dateToString(_form.fechaInicioFin[0], 'dd-MM-yyyy');
    const fechaFin = _form.fechaInicioFin && DateUtil.dateToString(_form.fechaInicioFin[1], 'dd-MM-yyyy');
    const documentoColaborador = _form.documentoColaborador;

    let invalidColaborador = false;

    if (null === documentoColaborador || '' === documentoColaborador) {
      invalidColaborador = true;
    }

    let invalidFecha = false;

    if ((!fechaInicio || null === fechaInicio) && (!fechaFin || null === fechaFin)) {
      invalidFecha = true;
    }

    if (invalidColaborador && invalidFecha) {
      this.translate.get('global.validateForm').subscribe((validateForm: string) => {
        this.frontService.alert.warning(validateForm);
      });
      return;
    }
    if (fechaInicio && (!fechaFin || null === fechaFin)) {
      this.translate.get('administracion.reportesGestionDiaria.alertas.fechaFinal').subscribe((validateForm: string) => {
        this.frontService.alert.warning(validateForm);
      });
      return;
    }

    const data = { isPaged } as any;
    if (isPaged) {
      data.page = pagina;
      data.size = tamanio;
    }
    if (null !== documentoColaborador && '' !== documentoColaborador) {
      data.identificacion = documentoColaborador;
    }
    if (fechaInicio) {
      data.fechaInicio = fechaInicio;
      data.fechaFin = fechaFin || fechaInicio;
    }
    return await this.backService.gestionDiaria.getGestionDiaria(data).toPromise();
  }
  _onSiguiente($event) {
    this.buscar($event.pagina, $event.tamano);
  }
  _onAtras($event) {
    this.buscar($event.pagina, $event.tamano);
  }

  _onClickCeldaElement(event) {
    const comentario = event.dato.commentMessage;
    this.observacion = comentario.includes('|') ? comentario.split('|')[0] : comentario || 'No hay observación';
    this.mostrarGuardar = true;
  }

  async _onClickExportarExcel() {
    if (this.configuracion.gridConfig.component && this.configuracion.gridConfig.component.hayDatos()) {
      await this.getData(false).then((respuesta: any) => {
          const headers: string[] = [
            'administracion.reportesGestionDiaria.grid.cedulaColaborador',
            'administracion.reportesGestionDiaria.grid.nombreColaborador',
            'administracion.reportesGestionDiaria.grid.numeroSolicitud',
            'administracion.reportesGestionDiaria.grid.estado',
            'administracion.reportesGestionDiaria.grid.fechaAsignacion',
            'administracion.reportesGestionDiaria.grid.fechaGestion',
            'administracion.reportesGestionDiaria.grid.asignadoPor',
            'administracion.reportesGestionDiaria.grid.observacion'
          ];

          const columnas: string[] = [
            'identification',
              'nombreColaborador',
              'numeroSolicitud',
              'estado',
              'fechaAsignacion',
              'fechaGestion',
              'asignadoPor',
              'observacion'
          ];
          ObjectUtil.traducirObjeto(headers, this.translate);

          // Se mapean solo las columnas que se quieren mostrar en el archivo Excel
          const datos = respuesta.content.map(x =>
            ({
              identification: x.userInfo?.identification,
              nombreColaborador: x.userInfo?.name,
              numeroSolicitud: x.processInstanceId,
              estado: x.name,
              fechaAsignacion: x.assigneeTime,
              fechaGestion: x.commentTime,
              asignadoPor: x.ownerInfo?.name,
              observacion: x.commentMessage.includes('|') ? x.commentMessage.split('|')[0] : x.commentMessage
            }));

          this.exportarExcel(
            `Reporte_GestionDiaria_${DateUtil.dateToString(new Date())}`, {
              headers,
            columnas,
            datos
          });
        }, err => {
          this.frontService.alert.warning(err.error.message);
        });
    }
  }

  private exportarExcel(nombre, datos: any = {}) {
    this.backService.utilidades.exportarExcel2(nombre, datos).subscribe(respuesta => {
      const body: any = respuesta.body;
      FileUtils.downloadXlsFile(body, nombre);
    });
  }

  _toggle(toggle: boolean) {
    this.mostrarGuardar = toggle;
  }

  limpiar() {
    this.habilitarBotonExportar = false;
    this.configuracion.gridConfig.component.limpiar();
    this.form.reset();
    this._initForm();
  }
}
