import { Observable, BehaviorSubject, forkJoin, of } from 'rxjs';
import { DatosAsociado } from '@shared/models';
import { DateUtil } from '@shared/util/date.util';
import { catchError } from 'rxjs/operators';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

export class AsociadoDataService {
  /**
   *
   * @description Subject al cual publicar cambios en el detalle del asociado.
   */
  private readonly _asociado: BehaviorSubject<DatosAsociadoWrapper> = new BehaviorSubject(undefined);

  /**
   * @description True si esta haciendo una peticion, false sino.
   *
   */
  requesting: boolean;

  /**
   *
   * @description Observable al cual subscribirse para cambios en la informacion del asociado.
   */
  public readonly asociado: Observable<DatosAsociadoWrapper> = this._asociado.asObservable();

  constructor(
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService) { }

  /**
   *
   * @description Se encarga de publicar cambios en el detalle del asociado.
   * @param accion Accion.
   * @param datosAsociado Identificador unico del asociado || Datos del asociado a publicar.
   * @param api True si debe pedir los datos a la API, false si solo debe publicarlos.
   */
  accion(accion: string, datosAsociado: string | DatosAsociado, api?: boolean) {
    if (!datosAsociado) {
      return;
    }

    // Añade control para no enviar una peticion si ya se estan solicitando los datos.
    if (this.requesting) {
      return;
    }

    if (api) {
      this.obtenerDatosAsociado(accion, String(datosAsociado));
    } else {
      this.obtenerDatosAsociadoParcial(accion, datosAsociado as DatosAsociado);
    }
  }

  obtenerDatosAsociado(action: string, asoNumInt: string) {
    this.requesting = true;
    const today: Date = new Date();

    //const obtenerAsociadoRequest = this.backService.asociado.obtenerAsociadoDatosBasicos({ nitCli, isPaged: true, page: 0, size: 1 }).pipe(
    const obtenerAsociadoRequest = this.backService.asociado.obtenerAsociado(asoNumInt).pipe(
      catchError(err => this.frontService.alert.error(err.error.message)),
    );

    const obtenerNivelRiesgoRequest = this.backService.asociado.getNivelRiesgo(asoNumInt).pipe(
      catchError(err => this.frontService.alert.error(err.error.message)),
    );

    const obtenerSalarioMinimoRequest = this.backService.asociado.getSalarioMinimo(today, today).pipe(
      catchError(err => this.frontService.alert.error(err.error.message)),
    );

    const obtenerPrimaNiveladaRequest = this.backService.asociado.getPrimaNivelada(asoNumInt).pipe(
      catchError(err => of(err.status)),
    );

    const obtenerDatosAcumulados = this.backService.vinculacion.getSipVinculaciones({ asoNumInt: asoNumInt }).pipe(
      catchError(err => of(err.status)),
    );

    forkJoin([obtenerAsociadoRequest, obtenerNivelRiesgoRequest, obtenerPrimaNiveladaRequest, obtenerSalarioMinimoRequest, obtenerDatosAcumulados])
      .subscribe(
        async next => {
          const respuestaObtenerAsociado = next[0];
          const respuestaObtenerNivelRiesgo = next[1];
          const respuestaObtenerPrimaNivelada = next[2];
          const respuestaObtenerSalarioMinimo = next[3];
          const _sipVinculaciones = next[4].content !== null && next[4].content !== undefined && next[4].content.length > 0 ? next[4].content[0] : null;
          const respuestaObtenerDatosAcumulados = _sipVinculaciones ? {
            proAcuVida: _sipVinculaciones.vinProteccionAcumulada,
            proMaxVida: _sipVinculaciones.sipVinculacionesRangos?.ranProteccionMax,
            proAcuPersevenrancia: _sipVinculaciones.vinPerseveranciaAcumulada,
            proMaxPerseverancia: _sipVinculaciones.sipVinculacionesRangos?.ranPerseveranciaMax,
            proAcuRenta: _sipVinculaciones.vinRentaAcumulada,
            proMaxRenta: _sipVinculaciones.sipVinculacionesRangos?.ranRentaMax,
            proAcuTotal: _sipVinculaciones.vinProteccionAcumuladaTotal,
            proMaxTotal: _sipVinculaciones.sipVinculacionesRangos?.ranProteccionTotal,
            proAcuAltoCosto: _sipVinculaciones.vinAltoCostoAcumulado,
            proAuxFunerario: _sipVinculaciones.vinAuxilioFunerario,
            desAuxFun: _sipVinculaciones.formaPagoDesAuxFun?.nombre,
            vinIndFechaNacimiento: _sipVinculaciones.vinIndFechaNacimiento,
            categoriaAsociado: _sipVinculaciones.sipVinculacionesClasificacion?.sipVinculacionesTipo?.vinDesc
          } : null;
          let resultadoDatosAsociado = respuestaObtenerAsociado; 

          if (respuestaObtenerNivelRiesgo && respuestaObtenerNivelRiesgo.nivelCod) {
            resultadoDatosAsociado.nivelRiesgo = respuestaObtenerNivelRiesgo.nivelCod;
          }

          resultadoDatosAsociado.smmlv = respuestaObtenerSalarioMinimo.smmlv;

          resultadoDatosAsociado.primaNivelada = respuestaObtenerPrimaNivelada as number;

          resultadoDatosAsociado.edad = DateUtil.calcularEdad(DateUtil.stringToDate(resultadoDatosAsociado.fecNac));
          resultadoDatosAsociado = Object.assign(resultadoDatosAsociado as DatosAsociado, respuestaObtenerDatosAcumulados);

          this._asociado.next({
            accion: action,
            datosAsociado: resultadoDatosAsociado
          });

          this.requesting = false;
        });
  }

  obtenerDatosAsociadoParcial(action: string, datosAsociado: DatosAsociado) {
    this.requesting = true;
    const today: Date = new Date();

    const asoNumInt = datosAsociado.numInt;

    const obtenerNivelRiesgoRequest = this.backService.asociado.getNivelRiesgo(asoNumInt).pipe(
      catchError(err => of(err.status)),
    );

    const obtenerSalarioMinimoRequest = this.backService.asociado.getSalarioMinimo(today, today).pipe(
      catchError(err => of(err.status)),
    );

    const obtenerPrimaNiveladaRequest = this.backService.asociado.getPrimaNivelada(asoNumInt).pipe(
      catchError(err => of(err.status)),
    );

    datosAsociado.edad = DateUtil.calcularEdad(DateUtil.stringToDate(datosAsociado.fecNac));
    const obtenerDatosAcumulados = this.backService.vinculacion.getSipVinculaciones({ asoNumInt: asoNumInt }).pipe(
      catchError(err => of(err.status)),
    );

    forkJoin([obtenerNivelRiesgoRequest, obtenerPrimaNiveladaRequest, obtenerSalarioMinimoRequest, obtenerDatosAcumulados])
      .subscribe(
        next => {
          const respuestaObtenerNivelRiesgo = next[0];
          const respuestaObtenerPrimaNivelada = next[1];
          const respuestaObtenerSalarioMinimo = next[2];
          const _sipVinculaciones = next[3].content[0];
          const respuestaObtenerDatosAcumulados = _sipVinculaciones ? {
            proAcuVida: _sipVinculaciones.vinProteccionAcumulada,
            proMaxVida: _sipVinculaciones.sipVinculacionesRangos?.ranProteccionMax,
            proAcuPersevenrancia: _sipVinculaciones.vinPerseveranciaAcumulada,
            proMaxPerseverancia: _sipVinculaciones.sipVinculacionesRangos?.ranPerseveranciaMax,
            proAcuRenta: _sipVinculaciones.vinRentaAcumulada,
            proMaxRenta: _sipVinculaciones.sipVinculacionesRangos?.ranRentaMax,
            proAcuTotal: _sipVinculaciones.vinProteccionAcumuladaTotal,
            proMaxTotal: _sipVinculaciones.sipVinculacionesRangos?.ranProteccionTotal,
            proAcuAltoCosto: _sipVinculaciones.vinAltoCostoAcumulado,
            proAuxFunerario: _sipVinculaciones.vinAuxilioFunerario,
            desAuxFun: _sipVinculaciones.formaPagoDesAuxFun?.nombre,
            vinIndFechaNacimiento: _sipVinculaciones.vinIndFechaNacimiento,
            categoriaAsociado: _sipVinculaciones.sipVinculacionesClasificacion?.sipVinculacionesTipo?.vinDesc
          } : null;
          let resultadoDatosAsociado = datosAsociado;

          if (respuestaObtenerNivelRiesgo && respuestaObtenerNivelRiesgo.nivelCod) {
            resultadoDatosAsociado.nivelRiesgo = respuestaObtenerNivelRiesgo.nivelCod;
          }

          resultadoDatosAsociado.smmlv = respuestaObtenerSalarioMinimo.smmlv;

          resultadoDatosAsociado.primaNivelada = respuestaObtenerPrimaNivelada as number;

          resultadoDatosAsociado = Object.assign(resultadoDatosAsociado as DatosAsociado, respuestaObtenerDatosAcumulados);

          this._asociado.next({
            accion: action,
            datosAsociado: resultadoDatosAsociado
          });

          this.requesting = false;
        });
  }
}

/**
 *
 * @description Wrapper de datos de asociado.
 */
export class DatosAsociadoWrapper {
  accion: string;
  datosAsociado: any;
}
