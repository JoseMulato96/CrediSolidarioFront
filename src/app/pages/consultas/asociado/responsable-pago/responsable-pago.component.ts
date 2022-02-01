import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertService, BackFacadeService, StoreService } from "@core/services";
import { ACTION_CONSULTA_STATE_ASOCIADO } from "@core/store/actions/app-action";
import { UrlRoute } from "@shared/static/urls/url-route";
import { Subscription } from "rxjs";
import { ResponsablePagoConfig } from "./responsable-pago.config";

@Component({
    selector: 'app-responsable-pago',
    templateUrl: './responsable-pago.component.html',
})
export class ResponsablePagoComponent implements OnInit, OnDestroy {

    _asoNumInt: string;
    _asoSubscription: Subscription;
    configuracion: ResponsablePagoConfig = new ResponsablePagoConfig();

    ngOnDestroy(): void {
    }

    constructor(
        private readonly router: Router,
        private readonly route: ActivatedRoute,
        private readonly alertService: AlertService,
        private readonly backService: BackFacadeService,
        private readonly redux: StoreService,
    ) { }


    ngOnInit(): void {
        this._asoSubscription = this.route.parent.parent.params.subscribe(params => {
            this._asoNumInt = params['asoNumInt'];
            if (!this._asoNumInt) {
                return;
            }
        });

        this.obtenerDatosListaAsegurado();
    }

    obtenerDatosListaAsegurado(pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc') {
        let caso = this._asoNumInt;
        const param: any = { page: pagina, asoNumInt: this._asoNumInt, size: tamanio, isPaged: true, sort };

        this.backService.responsablePersonas.getResponsablePersonas(param)
            .subscribe((respu: any) => {
                this.configuracion.gridListarResponsablePago.component.limpiar();

                if (!respu || !respu.content || respu.content.length === 0) {
                    return;
                }
                this.configuracion.gridListarResponsablePago.component.cargarDatos(
                    this.asignarEstados(respu.content), {
                    maxPaginas: respu.totalPages,
                    pagina: respu.number,
                    cantidadRegistros: respu.totalElements
                });
            }, (err) => {
                this.alertService.error(err.error.message);
            });
    }

    asignarEstados(items: any) {
        const listObj = [];
        let x: any;
        for (x of items) {
            var nombreCompleto = "";
            nombreCompleto = nombreCompleto.concat(x.mimPersona.primerNombre);
            nombreCompleto = nombreCompleto.concat(" ");
            nombreCompleto = nombreCompleto.concat(x.mimPersona.segundoNombre);
            nombreCompleto = nombreCompleto.concat(" ");
            nombreCompleto = nombreCompleto.concat(x.mimPersona.primerApellido);
            nombreCompleto = nombreCompleto.concat(" ");
            nombreCompleto = nombreCompleto.concat(x.mimPersona.segundoApellido);
          listObj.push({ ...x, _estado: x.estado ? 'Activo' : 'Inactivo', _nombreCompleto: nombreCompleto });
        }
        return listObj;
      }


    _OnAtras(e) {
        this.obtenerDatosListaAsegurado(e.pagina, e.tamano, e.sort);
    }

    _OnSiguiente(e) {
        this.obtenerDatosListaAsegurado(e.pagina, e.tamano, e.sort);
    }

    _ordenar(e) {
        this.obtenerDatosListaAsegurado(e.pagina, e.tamano, e.sort);
    }

    _OnDetalle(event: any) {
        this.redux.updateAppState({
            action: ACTION_CONSULTA_STATE_ASOCIADO
          });
          this.redux.setTipoAsegurado("1");
          this.router.navigate([
            UrlRoute.PAGES,
            UrlRoute.CONSULTAS,
            UrlRoute.CONSULTAS_ASOCIADO,
            event.mimPersona.numeroId,
            UrlRoute.CONSULTAS_ASOCIADO_DATOS_ASOCIADO
          ]);
    }

}
