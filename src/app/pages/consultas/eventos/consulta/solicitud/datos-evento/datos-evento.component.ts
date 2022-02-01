import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { SIP_PARAMETROS_TIPO } from '@shared/static/constantes/sip-parametros-tipo';
import { SERVICIOS_PARAMETROS } from '@shared/static/constantes/servicios-parametros';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-datos-evento',
  templateUrl: './datos-evento.component.html'
})
export class DatosEventoComponent implements OnInit, OnDestroy {

  _subs: Subscription[] = [];

  idProceso: string;
  asoNumInt: string;
  solicitudEvento: any;
  documentos: [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) { }

  ngOnInit() {

    this.solicitudEvento = {};
    this._subs.push(this.route.parent.params.subscribe((params) => {
      this.asoNumInt = params.asoNumInt;
    }));

    this._subs.push(this.route.params.subscribe((params) => {
      this.idProceso = params.idProceso;
      this._getData();
    }));
  }

  _getData() {

    const parametrosBeneficiarios = {
      codEstadoBenAso: SERVICIOS_PARAMETROS.beneficiarios.codEstadoBenAso,
      codEstadoBeneficiario: SERVICIOS_PARAMETROS.beneficiarios.codEstadoBeneficiario,
      codEstadoInactivo: SERVICIOS_PARAMETROS.beneficiarios.codEstadoInactivo,
      codEstadosBenAso: SERVICIOS_PARAMETROS.beneficiarios.codEstadosBenAso,
      codTipoBeneficiario: SERVICIOS_PARAMETROS.beneficiarios.codTipoBeneficiario.familiarDirecto
    };

    forkJoin({
      _solicitudEvento: this.backService.solicitudEvento.getSolicitudEvento(this.idProceso),
      _beneficiarios: this.backService.beneficiario.getBeneficiarios(this.asoNumInt, parametrosBeneficiarios),
      _retencionEventos: this.backService.parametro.getParametrosTipo(SIP_PARAMETROS_TIPO.RETENCION_EVENTO.TIP_COD),
      _oficinasExcluidas: this.backService.parametro.getParametros([SIP_PARAMETROS_TIPO.RETENCION_EVENTO.TIP_COD, SIP_PARAMETROS_TIPO.OFICINAS_EXCLUIDAS.VALOR_MINIMO]),
      _documentos: this.backService.documentosEvento.getDocumentosEventos({}),

    }).pipe(
      map(x => {
        return {
          _solicitudEvento: x._solicitudEvento,
          _beneficiarios: x._beneficiarios.map(t => {
            return {
              ...t,
              nombre: t.nomBeneficiario + ' ' + t.benApellido1 + ' ' + t.benApellido2
            };
          }),
          _retencionEventos: x._retencionEventos,
          _oficinasExcluidas: x._oficinasExcluidas.map(y => y.valor),
          _documentos: x._documentos.content && x._documentos.content.map(y => y.sipDocumentosRequeridos)
        };
      })
    ).subscribe((items) => {
      const t = items._solicitudEvento;
      this.solicitudEvento = t;
      this.solicitudEvento.tipoAuxilio = t.mimEvento.nombre;
      this.solicitudEvento.canal = t.mimCanal ? t.mimCanal.nombre : null;
      this.solicitudEvento.origen = t.mimOrigenCobertura ? t.mimOrigenCobertura.nombre : null;
      this.solicitudEvento.eventoPor = t.mimReclamoPor ? t.mimReclamoPor.nombre : null;
      this.solicitudEvento.tratamientoEspecial = t.tratamientoEspacial ? 'SI' : 'NO';
      this.solicitudEvento.asociadoBeneficiarioDeclaranteRenta = t.declarante ? 'SI' : 'NO';
      this.solicitudEvento.reclamaCopago = t.copago ? 'SI' : 'NO';
      this.solicitudEvento.nombreFormaPago = t.mimFormaPago ? t.mimFormaPago.nombre : null;
      this.solicitudEvento.nombreTipoCuenta = t.mimTipoCuentaBanco ? t.mimTipoCuentaBanco.nombre : null;
      this.solicitudEvento.nombreBanco = t.mimBanco ? t.mimBanco.nombre : null;
      this.solicitudEvento.pagarA = t.mimTipoBeneficiarioPago ? t.mimTipoBeneficiarioPago.nombre : null;
      this.solicitudEvento.cuotaMes = t.descuentoCuotaMes ? 'SI' : 'NO';
      this.solicitudEvento.saldoVencido = t.descuentoSaldosVencidos ? 'SI' : 'NO';
      this.solicitudEvento.credito = t.abonaCredito ? 'SI' : 'NO';

      this.solicitudEvento.estado = t.mimEstadoSolicitudEvento.codigo === MIM_PARAMETROS.MIM_ESTADOS_SOLICITUD_EVENTO.EN_PROCESO ?
        t.mimFaseFlujo ? t.mimFaseFlujo.nombre : t.mimEstadoSolicitudEvento.nombre : t.mimEstadoSolicitudEvento.nombre;

      this.solicitudEvento.beneficiario = t.codigoBeneficiarioAsociado ? items._beneficiarios
        .find(item => item.codBeneficiario === t.codigoBeneficiarioAsociado).valor : null;

      const retencionEvento = t.codigoRetencionEvento ? items._retencionEventos.sipParametrosList
        .find(item => item.sipParametrosPK.codigo === t.codigoRetencionEvento) : null;

      this.solicitudEvento.valorRetencion = retencionEvento ? retencionEvento.valor : 0;

      this.backService.sispro.getDatosUser({ tipoIdentificacion: 'CC', numeroIdentificacion: this.solicitudEvento.usuarioRecibePor }).subscribe(usuario => {
        this.solicitudEvento.solicitudRecibidaPor = usuario.user.name;
      }, (err) => {
        this.frontService.alert.warning(err.error.description);
      });

      this.documentos = null;

      const codigo: any[] = items._oficinasExcluidas;
      const params: any = { oficinasExcluidas: codigo, excluirCentroOperaciones: true, excluirTesoreria: true };
      this.backService.oficinas.getOficinas(params).subscribe(oficinas => {

        if (t.oficinaRegistro) {
          this.solicitudEvento.nombreOficina = oficinas.find(item => item.agCori === t.oficinaRegistro).nomAgc;
        } else {
          this.solicitudEvento.nombreOficina = null;
        }

        if (t.oficinaGiro) {
          this.solicitudEvento.nombreOficinaCheque = oficinas.find(item => item.agCori === t.oficinaGiro).nomAgc;
        } else {
          this.solicitudEvento.nombreOficinaCheque = null;
        }
      });

    }, (err) => {
      this.frontService.alert.warning(err.error.message);
    });

  }

  ngOnDestroy() {
    this._subs.forEach(x => x.unsubscribe());
  }

}
