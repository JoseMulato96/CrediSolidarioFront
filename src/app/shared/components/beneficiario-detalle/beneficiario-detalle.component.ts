import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { APP_PARAMETROS } from '@shared/static/constantes/app-parametros';
import { UrlRoute } from '@shared/static/urls/url-route';
import { DateUtil } from '@shared/util/date.util';

@Component({
  selector: 'app-beneficiario-detalle',
  templateUrl: './beneficiario-detalle.component.html',
  styleUrls: ['./beneficiario-detalle.component.css']
})
export class BeneficiarioDetalleComponent implements OnInit {
  active: boolean;
  hiddenStatus: boolean;
  detalles = APP_PARAMETROS.BENEFICIARIO_DETALLES[0];
  asonumInt = '';

  @Input()
  // tslint:disable-next-line:no-use-before-declare
  configuracion: BeneficiarioDetalleConfiguracion = new BeneficiarioDetalleConfiguracion();

  @Input()
  disableEdit = false;

  // tslint:disable-next-line:no-input-rename
  @Input('disable-delete')
  disableDelete = false;

  // tslint:disable-next-line:no-output-rename
  @Output('click-editar')
  clickEditar: EventEmitter<any> = new EventEmitter<any>();

  // tslint:disable-next-line:no-output-rename
  @Output('click-eliminar')
  clickEliminar: EventEmitter<any> = new EventEmitter<any>();

  constructor(private readonly router: Router) { }

  ngOnInit() {
    this.configuracion.edad = DateUtil.calcularEdad(
      DateUtil.stringToDate(this.configuracion.benFecNac)
    );
    this.hiddenStatus = false;
    if (this.configuracion.benDesCorEst === this.detalles.estadoRepetido) {
      this.hiddenStatus = true;
    }
  }

  toogleCollpase() {
    this.active = !this.active;
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description eliminar el componente.
   */
  eliminarBeneficiarios(e) {
    this.clickEliminar.emit(e);
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description editar el componente
   */
  editarBeneficiarios(e) {
    this.clickEditar.emit(e);
  }

  /**
   * @author Hander Gutierrez
   * @description redirigir a la pantalla de beneficiario asociado
   */
  _onRedirectToInformacion(e) {
    const vista = [
      UrlRoute.PAGES,
      UrlRoute.CONSULTAS,
      UrlRoute.CONSULTAS_ASOCIADO,
      this.configuracion.numInt,
      UrlRoute.BENEFICIARIOS_ASOCIADO
    ].join('/');

    this.router.navigate(
      [
        UrlRoute.PAGES,
        UrlRoute.CONSULTAS,
        UrlRoute.BENEFICIARIOS,
        UrlRoute.BENEFICIARIOS_INFORMACION,
        e,
        UrlRoute.BENEFICIARIOS_ASOCIADO_RELACIONADOS
      ],
      {
        queryParams: {
          vista: vista
        }
      }
    );
  }
}

export class BeneficiarioDetalleConfiguracion {
  public nomBeneficiario = '';
  public benApellido1 = '';
  public benApellido2 = '';
  public benDesCorTipIden = '';
  public benNumIdentificacion = '';
  public benPorcentaje = 0;
  public benDesCorEst = '';
  public benDesParentesco = '';
  public benDesSexo = '';
  public benDesInvalido = '';
  public edad = 0;
  public benFecNac = '';
  public benFecReg = '';
  public desCorTipoBen = '';
  public desGrupo = '';
  public benDesTip = '';
  public prodNombre = '';
  public codBeneficiario;
  numInt: any;
}
