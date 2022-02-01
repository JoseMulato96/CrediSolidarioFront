import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FormValidate } from '@shared/util';
import { DateUtil } from '@shared/util/date.util';
import { FormComponent } from '@core/guards';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SIP_PARAMETROS_TIPO } from '@shared/static/constantes/sip-parametros-tipo';
import { IValoresEvento } from '@shared/models/valores-evento.model';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-mim-valores-evento',
  templateUrl: './mim-valores-evento.component.html',
})
export class MimValoresEventoComponent extends FormValidate implements OnInit , FormComponent {

  @Output() vlrCuotaMensual = new EventEmitter<any>();
  @Output() vlrSaldosVencidos = new EventEmitter<any>();
  @Output() vlrDeduccionesVarias = new EventEmitter<any>();

  @Output() formGroupChange = new EventEmitter<any>();

  formValores: FormGroup;
  isForm: Promise<any>;
  oficinas: any[] = [];
  formasPago: any[] = [];
  bancos: any[];
  tiposCuenta: any[];
  pagarA: any[];
  retencionEvento: any[];
  esDeposito: boolean;
  esCheque: boolean;

  valorDeduccionesVarias: number;
  valorCuotaMensual: number;
  valorSaldosVencidos: number;

  @Input() faseFlujo: number;
  @Input() datosValores: any;
  @Input() asoNumInt: string;

  maxDate: Date = new Date();
  mostrarCopago: boolean;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    super();
    this.bancos = [];
    this.tiposCuenta = [];
    this.mostrarCopago = false;
  }

  ngOnInit() {
    this.mostrarCopago = this.faseFlujo === 1 ? true : false;
    this._getData();
  }

  _initForm(param?: any) {
    this.isForm = Promise.resolve(
      this.formValores = this.formBuilder.group({
        fechaEvento: new FormControl(param ? DateUtil.stringToDate(param.fechaEvento) : null, [Validators.required]),
        formaPago: new FormControl(param && param.mimFormaPago ? this._setFormaPago(param.mimFormaPago.codigo) : null, [Validators.required]),
        banco: new FormControl(param && param.mimBanco ? this._setBanco(param.mimBanco.codigo) : null),
        tipoCuenta: new FormControl(param && param.mimTipoCuentaBanco ? this._setTipoCuenta(param.mimTipoCuentaBanco.codigo) : null),
        numeroCuenta: new FormControl(param ? param.numeroCuentaDeposito : null, [Validators.maxLength(17)]),
        valorPagar: new FormControl(param ? param.valorSolicitado : null, [Validators.required, Validators.maxLength(10)]),
        oficina: new FormControl(param && param.oficinaGiro ? this._setOficina(param.oficinaGiro) : null),
        retencionEvento: new FormControl(param && param.codigoRetencionEvento ? this._setRetencionEvento(param.codigoRetencionEvento) : null, [Validators.required]),
        pagarA: new FormControl(param && param.mimTipoBeneficiarioPago ? this._setPagarA(param.mimTipoBeneficiarioPago.codigo) : null, [Validators.required]),
        descuentoCuotaMes: new FormControl(param ? param.descuentoCuotaMes : null),
        descuentoSaldoVencido: new FormControl(param ? param.descuentoSaldosVencidos : true),
        abonaCredito: new FormControl(param ? param.abonaCredito : null),
        reclamaCopago: new FormControl(param && param.copago ? param.copago : false)
      })
    );

    if (param) {
      this.formGroupChange.emit(this.formValores);
    }

    if (param && param.mimFormaPago) {
      this._getFormaPago(param.mimFormaPago.codigo);
    }

    this._bloquearAbonaCredito(this.datosValores.mimEvento.codigo, this.datosValores.mimEvento);

    this._bloquearCopago(this.datosValores.mimEvento.codigo, this.datosValores.mimEvento);
    this._change();
  }

  _bloquearAbonaCredito(codigoTipoEvento: number, evento: any) {
    if (codigoTipoEvento === evento.codigo && evento.aplicaAbonaCredito) {
      this.formValores.controls.abonaCredito.enable();
      this.formValores.controls.abonaCredito.setValidators([Validators.required]);
    } else {
      this.formValores.controls.abonaCredito.disable();
    }
  }

  _bloquearCopago(codigoTipoEvento: number, evento: any) {
    if (codigoTipoEvento === evento.codigo && evento.aplicaCopago) {
      this.formValores.controls.reclamaCopago.enable();
      this.formValores.controls.reclamaCopago.setValidators([Validators.required]);
    } else {
      this.formValores.controls.reclamaCopago.disable();
    }
  }

  _setFormaPago(codigo: string) {
    return this.formasPago.find(item => item.codigo === codigo);
  }

  _setBanco(codigo: string) {
    return this.bancos.find(item => item.codigo === codigo);
  }

  _setTipoCuenta(codigo: string) {
    return this.tiposCuenta.find(item => item.codigo === codigo);
  }

  _setOficina(codigo: string) {
    return this.oficinas.find(item => item.agCori === codigo);
  }

  _setRetencionEvento(codigo: string) {
    return this.retencionEvento.find(item => item.sipParametrosPK.codigo === codigo);
  }

  _setPagarA(codigo: string) {
    return this.pagarA.find(item => item.mimTipoBeneficiarioPago.codigo === codigo);
  }

  _change() {
    this.formValores.valueChanges.subscribe(() => {
      this.formGroupChange.emit(this.formValores);
    });

    this.formValores.controls.formaPago.valueChanges.subscribe(valor => {
      if (valor) {
        this._getFormaPago(valor.codigo);
      }
    });

    if (this.faseFlujo !== 1) {
      this.formValores.controls.descuentoCuotaMes.valueChanges.subscribe(cuotaMes => {
        if (cuotaMes) {
          this.vlrCuotaMensual.emit(true);
        } else {
          this.vlrCuotaMensual.emit(false);
        }
      });

      this.formValores.controls.descuentoSaldoVencido.valueChanges.subscribe(saldoVencido => {
        if (saldoVencido) {
          this.vlrSaldosVencidos.emit(true);
        } else {
          this.vlrSaldosVencidos.emit(false);
        }
      });
    }

  }

  _getFormaPago(codigoFormaPago: number) {
    switch (codigoFormaPago) {
      case 1: {
        this.esDeposito = false;
        this.esCheque = true;
        this.formValores.controls.numeroCuenta.setValue(null);
        this.formValores.controls.numeroCuenta.setErrors(null);
        this.formValores.controls.oficina.setValidators([Validators.required]);
        this.formValores.controls.banco.setValue(null);
        this.formValores.controls.tipoCuenta.setValue(null);
        break;
      }
      case 2: {
        this.esDeposito = true;
        this.esCheque = false;
        this.formValores.controls.numeroCuenta.setValidators([Validators.required]);
        this.formValores.controls.oficina.setValue(null);
        this.formValores.controls.oficina.setErrors(null);
        break;
      }
      default: {
        this.esDeposito = false;
        this.esCheque = false;
      }
    }
  }

  _getData() {
    forkJoin({
      _retencionEventos: this.backService.parametro.getParametrosTipo(SIP_PARAMETROS_TIPO.RETENCION_EVENTO.TIP_COD),
      _oficinasExcluidas: this.backService.parametro.getParametros([SIP_PARAMETROS_TIPO.OFICINAS_EXCLUIDAS.PAGO_POR_GIRO, SIP_PARAMETROS_TIPO.OFICINAS_EXCLUIDAS.VALOR_MINIMO]),
      _formaPago: this.backService.formasPago.getFormasPago({estado: true}),
      _bancos: this.backService.cuentaBanco.getBancos({estado: true}),
      _tiposCuenta: this.backService.cuentaBanco.getTipoCuenta({estado: true}),
      _pagarA: this.backService.eventoTipoBeneficiarioPago.obtenerEventoTipoBeneficiarioPago({codigoEvento: this.datosValores.mimEvento.codigo, 'mimTipoBeneficiarioPago.estado': true})
    }).pipe(
      map(x => {
        return {
          _retencionEventos: x._retencionEventos,
          _oficinasExcluidas: x._oficinasExcluidas.map(y => y.valor),
          _formaPago: x._formaPago._embedded.mimFormaPago,
          _bancos: x._bancos._embedded.mimBanco,
          _tiposCuenta: x._tiposCuenta._embedded.mimTipoCuentaBanco,
          _pagarA: x._pagarA
        };
      })
    ).subscribe((oficinasExcluidas) => {
      this.retencionEvento = oficinasExcluidas._retencionEventos.sipParametrosList;
      this.pagarA = oficinasExcluidas._pagarA;
      this.bancos = oficinasExcluidas._bancos;
      this.tiposCuenta = oficinasExcluidas._tiposCuenta;
      this.formasPago = oficinasExcluidas._formaPago;
      const codigo: any[] = oficinasExcluidas._oficinasExcluidas;
      const params: any = {oficinasExcluidas: codigo, excluirCentroOperaciones: true, excluirTesoreria: true };
      this.backService.oficinas.getOficinas(params).subscribe(item => {
        this.oficinas = item;
        this._initForm(this.datosValores);
      });
    });
  }

  _enviarData() {
    if (this.formValores.invalid) {
      this.validateForm(this.formValores);
      this.translate.get('global.validateForm').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return null;
    }

    const _form = this.formValores.getRawValue();
    const valoresEvento = {
      fechaEvento: DateUtil.dateToString(_form.fechaEvento, 'dd-MM-yyyy'),
      formaPago: _form.formaPago || null,
      numeroCuenta: _form.numeroCuenta || null,
      valorSolicitado: _form.valorPagar,
      oficina: _form.oficina && _form.oficina.agCori,
      cuotaMes: _form.descuentoCuotaMes,
      saldoVencido: _form.descuentoSaldoVencido,
      banco: _form.banco || null,
      tipoCuenta: _form.tipoCuenta || null,
      retencionEvento: _form.retencionEvento && _form.retencionEvento.sipParametrosPK.codigo || null,
      pagarA: _form.pagarA.mimTipoBeneficiarioPago,
      abonaCredito: _form.abonaCredito && _form.abonaCredito !== null ? _form.abonaCredito : false,
      esDeposito: this.esDeposito,
      esCheque: this.esCheque,
      nombreOficina: _form.oficina && _form.oficina.nomAgc || '',
      nombreTipoCuenta: _form.tipoCuenta && _form.tipoCuenta.nombre || '',
      nombreBanco: _form.banco && _form.banco.nombre || '',
      nombreFormaPago: _form.formaPago && _form.formaPago.nombre || '',
      porcentajeRetefuente: _form.retencionEvento && _form.retencionEvento.valor || 0,
      copago: _form.reclamaCopago
    } as IValoresEvento;

    return valoresEvento;
  }

  hasChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return !this.isPristine(this.formValores) && this.formValores && this.formValores.dirty;
  }

}
