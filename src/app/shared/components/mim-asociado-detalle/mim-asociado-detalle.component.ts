import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UrlRoute } from '@shared/static/urls/url-route';
import { ObjectUtil } from '@shared/util/object.util';

@Component({
  selector: 'app-mim-asociado-detalle',
  templateUrl: './mim-asociado-detalle.component.html',
  styleUrls: ['./mim-asociado-detalle.component.css']
})
export class AsociadoDetalleComponent implements OnInit {
  @Input()
  // tslint:disable-next-line:no-use-before-declare
  configuracion: AsociadoDetalleConfiguracion = new AsociadoDetalleConfiguracion();

  constructor(
    @Inject(DOCUMENT) document: any,
    private readonly router: Router
  ) { }

  ngOnInit() {
    // do nothing
  }

  /**
   * @description Retorna la clase para el indicador de fecha de nacimiento correspondiente
   *
   * @param indicador Indicador de fecha de nacimiento.
   */
  calcularIndFecNac(indicador: number) {
    switch (indicador) {
      case 1:
        return ['icon-Valida', 'text--green2'];
      case 2:
        return ['icon-Pendiente', 'text--red1'];
      case 3:
        return ['icon-No-valida', 'text--gray2'];
      default:
        return ['icon-No-valida', 'text--gray2'];
    }
  }

  /**
   * @description Al redireccionar a datos basicos de asociado.
   *
   */
  irADatosBasicos() {
    const paths = [
      UrlRoute.PAGES,
      UrlRoute.CONSULTAS,
      UrlRoute.CONSULTAS_ASOCIADO,
      this.configuracion.numInt,
      UrlRoute.CONSULTAS_ASOCIADO_DATOS_ASOCIADO
    ];
    const urlFull = document.location.href;
    const url = paths.join('/');
    const urlNew = urlFull.split('#')[0] + '#/' + url;

    window.open(urlNew, '', 'width=' + window.outerWidth + ',height=' + window.outerHeight + ',left=0,top=0');

  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description copia enviado en el porta papeles
   */
  _onClickCopiar(text: any) {
    ObjectUtil.copiarAlClipboard(text);
  }

  _toggle() {
    this.configuracion._dropdown = !this.configuracion._dropdown;
  }
}

export class AsociadoDetalleConfiguracion {
  nomCli = '';
  nitCli?: number = null;
  numInt: string;
  fecNac = '';
  vinIndFechaNacimiento?: number;
  fecIngreso?: string;
  desCorte?: string;
  nivelRiesgo?; string;
  edad?: number;
  profesion?: string;

  _dropdown = false;
}
