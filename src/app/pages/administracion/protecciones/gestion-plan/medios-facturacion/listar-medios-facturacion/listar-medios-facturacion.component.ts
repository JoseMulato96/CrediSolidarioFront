import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from '@core/services';
import { UrlRoute } from '@shared/static/urls/url-route';
import { ListarMediosFacturacionConfig } from './listar-medios-facturacion.config';
import { PlanMediosFacturacionService } from '../services/plan-medios-facturacion.service';

@Component({
  selector: 'app-listar-medios-facturacion',
  templateUrl: './listar-medios-facturacion.component.html',
})
export class ListarMediosFacturacionComponent implements OnInit {

  public linkCrear: string;
  configuracion: ListarMediosFacturacionConfig = new ListarMediosFacturacionConfig();
  estado: boolean;

  constructor(
    private readonly router: Router,
    private readonly translate: TranslateService,
    private readonly alertService: AlertService,
    private readonly planMediosFacturacionService: PlanMediosFacturacionService
  ) { }

  ngOnInit() {
    this.linkCrear = UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_MEDIO_FACTURACION_PLAN_NUEVO;
    this.estado = true;
  }

  obtener(pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc', estado = 'true') {
    this.planMediosFacturacionService.listarPlanMediosFacturacion({ page: pagina, size: tamanio, isPaged: true, sort: sort, estado: estado })
      .subscribe((respuesta: any) => {
        this.configuracion.gridConfig.component.limpiar();
        if (!respuesta || !respuesta.content || respuesta.content.length === 0) {
          return;
        }
        this.configuracion.gridConfig.component.cargarDatos(
          this.asignarEstados(respuesta.content), {
          maxPaginas: respuesta.totalPages,
          pagina: respuesta.number,
          cantidadRegistros: respuesta.totalElements
        });
      }, (err) => {
        this.alertService.warning(err.error.message);
      });
  }


  asignarEstados(items: any) {
    const listObj = [];
    let item: any;
    for (item of items) {
      listObj.push({ ...item, _estado: item.estado ? 'Si' : 'No' });
    }
    return listObj;
  }

  _onClickCeldaElement(event) {
    if (event.col.key === 'editar') {
      this._alEditar(event.dato);
    }
  }

  _onSiguiente(e: any) {
    this._obtenerDatosConEstados(e, this.estado);
  }

  _onAtras(e: any) {
    this._obtenerDatosConEstados(e, this.estado);
  }

  _alEditar(event: any) {
    const planMedioFacturacion = event;
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINSTRACION_PROTECCIONES,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_MEDIO_FACTURACION_PLAN,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_MEDIO_FACTURACION_PLAN_CODIGO_PLAN,
      planMedioFacturacion.mimPlan.codigo,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_MEDIO_FACTURACION_PLAN_CODIGO_MEDIO_FACTURACION,
      planMedioFacturacion.mimMedioFacturacion.codigo
    ]);
  }

  _ordenar($event) {
    this._obtenerDatosConEstados($event, this.estado);
  }

  _onToggleStatus($event) {
    this._obtenerDatosConEstados($event, $event.currentTarget.checked);
  }

  _obtenerDatosConEstados($event, estado: boolean) {
    this.estado = estado;
    this.obtener($event.pagina, $event.tamano, $event.sort, this.estado ? 'true' : '');
  }

}
