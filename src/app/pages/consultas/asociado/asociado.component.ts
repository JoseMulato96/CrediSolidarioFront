import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, BackFacadeService, FrontFacadeService } from '@core/services';
import { Acciones } from '@core/store/acciones';
import { DatosAsociadoWrapper } from '@core/store/asociado-data.service';
import { DataService } from '@core/store/data.service';
import { AppState } from '@core/store/reducers';
import { Store } from '@ngrx/store';
import {
  AsociadoProductoDetalleConfiguracion,
  ItemProductoDetalleConfiguracion
} from '@shared/components/asociado-producto-detalle/asociado-producto-detalle.component';
import { MimFiltroVerticalItemComponent } from '@shared/components/mim-filtro-vertical/mim-filtro-vertical-item/mim-filtro-vertical-item.component';
import { ItemsSubMenuConfigure, SubmenuConfiguracion } from '@shared/components/mim-menu-vertical/mim-menu-vertical.component';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { UrlRoute } from '@shared/static/urls/url-route';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import * as acciones from '../asociado/protecciones-asociados/portafolio-plan-cobertura/portafolio.actions'; // '../portafolio.actions';
import { DatosAsociadosConfig } from './datos-asociados.config';
import { EventoAsociadosService } from './services/evento-asociados.service';
import { ProductoDetalleService } from './services/producto-detalle.service';

@Component({
  selector: 'app-asociado',
  templateUrl: './asociado.component.html',
  styleUrls: ['./asociado.component.css']
})
export class AsociadoComponent implements OnInit, OnDestroy, AfterViewInit {
  shownPanel = 0;

  _asoNumInt: any;
  datosAsociado: any = {};

  ocultarAtras = true;
  urlAtras: string[] = [];

  ocultarSubMenu = false;
  tipoAsociado: any;
  ocultarAsociadoProductoDetalle = true;

  subs: Subscription[] = [];
  _redirigir: any = [];

  subSubMenus: SubmenuConfiguracion = new SubmenuConfiguracion();
  detallesProducto: AsociadoProductoDetalleConfiguracion = new AsociadoProductoDetalleConfiguracion();
  configuracion: DatosAsociadosConfig = new DatosAsociadosConfig();

  @ViewChild('displayUl') displayUl: ElementRef;
  _childMenus: MimFiltroVerticalItemComponent[];
  mostrarSubmenuConsultas: boolean;
  mostrarDetalleAsociado: boolean;

  esResponsablePago: boolean = false;
  esAsegurado: boolean = false;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly productEvent: ProductoDetalleService,
    private readonly dataService: DataService,
    private readonly eventoAsociado: EventoAsociadosService,
    private readonly store: Store<AppState>,
    private readonly auth: AuthenticationService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService,) {
    this.reiniciar();
    this.productEvent.getCambioDetalleProducto().subscribe(respuesta => {
      if (respuesta) {
        this.detallesProducto.items = respuesta.detalles as ItemProductoDetalleConfiguracion[];
        this.detallesProducto.seleccion = respuesta.detalleSeleccion as ItemProductoDetalleConfiguracion;
        this.detallesProducto.seleccion['selecion'] = true;
        this.detallesProducto.plan = respuesta.plan;
      }
    });
  }
  ngAfterViewInit(): void {
    this.subs.push(this.store.select('portafolioAsociado').pipe(delay(0)).subscribe(datos => {
      this.mostrarSubmenuConsultas = datos ? datos.mostrarSubMenuConsultas : true;
      this.mostrarDetalleAsociado = datos ? datos.mostrarDetalleAsociado : true;
    }));
  }

  ngOnInit() {
    this.store.dispatch(acciones.mostrarMenuConsultas({ datos: true }));
    this.store.dispatch(acciones.mostrarDetalleAsociado({ datos: true }));

    this._publicarDatosAsociado();

    this.route.parent.params.subscribe(async params => {
      this._asoNumInt = params.asoNumInt;
      if (!this._asoNumInt) {
        return;
      }
      await this.obtenerAsociado();
      this.subs.push(
        this.eventoAsociado.atras().subscribe(async dato => {
          this.ocultarAtras = await dato.mostrar;
          this.urlAtras = dato.url;
        })
      );
      this.subs.push(
        this.eventoAsociado.summenu().subscribe(async dato => {
          this.ocultarSubMenu = await dato.mostrar;
        })
      );

      this.subs.push(this.dataService
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
          if (this.datosAsociado) {
            this.encontrarAsociadoNitCli(this.datosAsociado.nitCli);
          }
        }));
    });

    this.subs.push(this.productEvent.store.subscribe((respuesta: any) => {
      this.ocultarAsociadoProductoDetalle = respuesta === undefined || respuesta === null;
    }));


  }

  async encontrarAsociadoNitCli(nitCli: any) {
    await this.backService.asociado.buscarAsociado({ nitCli, isPaged: true, page: 0, size: 1 }).subscribe((respuesta: any) => {

      if (respuesta) {
        const datosAsociado = respuesta.content[0];
        this.datosAsociado.tipoAsociado = datosAsociado.tipoAsociado;

        if (this.datosAsociado.tipoAsociado === MIM_PARAMETROS.MIM_TIPO_ASOCIADO.ASEGURADO) {
          this.esAsegurado = true;
          this.esResponsablePago = false
        }
        if (this.datosAsociado.tipoAsociado === MIM_PARAMETROS.MIM_TIPO_ASOCIADO.RESPONSABLE_PAGO) {
          this.esResponsablePago = true;
          this.esAsegurado = false;
        }
      }
    }, (err: any) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  ngOnDestroy() {
    this.subs.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
    this.subs = undefined;
  }

  /**
   * @description Publicar datos de asociado.
   *
   */
  _publicarDatosAsociado() {
    this.dataService
      .asociados()
      .accion(Acciones.Publicar, this._asoNumInt, true);
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description escucha cuando ha cambiado el detalle
   */
  _cambiarDetalledelProducto(dato: { detalle: any; plan: any; tab: string }) {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.CONSULTAS,
      UrlRoute.CONSULTAS_ASOCIADO,
      this._asoNumInt,
      UrlRoute.PROTECCIONES,
      dato.plan.proCod,
      UrlRoute.PORTAFOLIO_ASOCIADO_DETALLE,
      dato.detalle.consecutivo,
      dato.tab
    ]);
  }

  seleccionOpcion(router: string[]) {
    this.ocultarAtras = false;
    const url = router.join('/').replace(':asoNumInt', this._asoNumInt);
    this.router.navigateByUrl(url);
    this.goToPanelLeftClose();
  }

  goToPanelLeft(item: any) {
    this.goToPanelLeftClose();
    if (item.items && item.items.length > 0) {
      const linkMenuPrincipal = { ...item.link };
      this.subSubMenus.items = item.items.map(x => {
        const direccion = Object.values(linkMenuPrincipal);
        direccion.push(x.link[0]);
        return { ...x, link: direccion };
      });
      this.subSubMenus.titulo = '';
      this.shownPanel = 1;
    } else {
      const router: string[] = item.link;
      const url = router.join('/').replace(':asoNumInt', this._asoNumInt);
      this.router.navigateByUrl(url);
      this.goToPanelLeftClose();
    }
  }

  goToPanelLeftClose() {
    this.shownPanel = 0;
  }

  irAtras() {
    const url: string[] = this.urlAtras;
    this.reiniciar();
    this.router.navigate(url);
  }

  reiniciar() {
    this.ocultarAtras = false;
    this.urlAtras = [];
    this.ocultarSubMenu = true;
  }


  /**Obtenemos el menu lateral */
  getMenu(codMenuPrimerNivel, codMenu) {
    const subMenu = this.auth.getUser().menus
      .filter(x => !!x.subMenus.find(t => t.appObject.code === 'MM_FLOTANTE_CONSULTA_ASOCIADO'))[0].subMenus
      .find(x => x.appObject.code === 'MM_FLOTANTE_CONSULTA_ASOCIADO');
    subMenu.subMenus = subMenu.subMenus.sort((a, b) => a.appObject.order - b.appObject.order);

    const submenus: SubmenuConfiguracion = new SubmenuConfiguracion();
    submenus.titulo = 'Consultas';
    submenus.items = this.buildSubmenu(subMenu.subMenus);
    return submenus;
  }

  /**Recorremos el json obtenido del menu */
  buildSubmenu(listSubmenus: any) {

    const itemsSubmenu: ItemsSubMenuConfigure[] = [];

    for (const list of listSubmenus) {
      if (list.appObject.code === 'MM_CONSUL_ASOC_DATOS_BASICO') {
        itemsSubmenu.push(this.buildSm(list));
      }
      if (list.appObject.code === 'MM_CONSUL_ASOC_PROTECCIONES') {
        itemsSubmenu.push(this.buildSm(list));
      }
      if (list.appObject.code === 'MM_CONSUL_ASOC_BENEFICIARIOS') {
        itemsSubmenu.push(this.buildSm(list));
      }
      if (list.appObject.code === 'MM_CONSUL_ASOC_PREEXISTENCIAS') {
        itemsSubmenu.push(this.buildSm(list));
      }
      if (list.appObject.code === 'MM_CONSUL_ASOC_RESP') {
        if (this.tipoAsociado === MIM_PARAMETROS.MIM_TIPO_ASOCIADO.ASEGURADO) {
          itemsSubmenu.push(this.buildSm(list));
        }
      }
      if (list.appObject.code === 'MM_CONSUL_ASOC_FACT') {
        if (this.tipoAsociado === MIM_PARAMETROS.MIM_TIPO_ASOCIADO.RESPONSABLE_PAGO) {
          itemsSubmenu.push(this.buildSm(list));
        }
      }
      if (list.appObject.code === 'MM_CONSUL_ASOC_GENERAL') {
        if (this.tipoAsociado === MIM_PARAMETROS.MIM_TIPO_ASOCIADO.RESPONSABLE_PAGO) {
          itemsSubmenu.push(this.buildSm(list));
        }
      }
      if (list.appObject.code === 'MM_CONSUL_ASOC_ASEG') {
        if (this.tipoAsociado === MIM_PARAMETROS.MIM_TIPO_ASOCIADO.RESPONSABLE_PAGO) {
          itemsSubmenu.push(this.buildSm(list));
        }
      }
    }
    return itemsSubmenu;
  }

  /**Construimos el submenu para el componente  */
  buildSm(items) {
    const itemsSM: any[] = [];
    const linkTop = items.appObject.action.substr(1).split('/');
    let noClick = false;
    const iconCss = items.appObject.image;
    if (items.subMenus.length > 0) {
      noClick = true;
    }
    if (items.subMenus.length > 0) {
      for (const item of items.subMenus) {
        const x = item.appObject.action.substr(1).split('/');
        itemsSM.push({
          titulo: item.appObject.name,
          link: x.pop().split('/'),
        });
      }
    }
    let data: any = {
      titulo: items.appObject.name,
      link: linkTop,
      noClick: noClick,
      iconCss: iconCss
    };
    if (itemsSM.length > 0) {
      data = {
        ...data,
        items: itemsSM,
      };
    }
    return data;
  }

  _onClickUp() {
    if (this.displayUl.nativeElement.children.length) { this.displayUl.nativeElement.scrollTop -= this.displayUl.nativeElement.children[0].offsetWidth; }
  }

  _onClickDown() {
    if (this.displayUl.nativeElement.children.length) {
      this.displayUl.nativeElement.scrollTop += this.displayUl.nativeElement.children[0].offsetWidth;
    }
  }

  async obtenerAsociado() {
    await this.backService.asociado.obtenerAsociado(this._asoNumInt).subscribe((respuesta: any) => {
      let nitCli = respuesta.nitCli;
      this.backService.asociado.buscarAsociado({ nitCli, isPaged: true, page: 0, size: 10 }).subscribe((resp: any) => {
        if (resp != null) {
          this.tipoAsociado = resp.content[0].tipoAsociado;
          this.subs.push(this.store.select('menuPadreActivo')
            .subscribe((resp: any) => {
              this.configuracion.submenu = this.getMenu(resp.codeMenuPrimerNivel, resp.codeMenuPadreActivar);
            }));
        }
      }, (err: any) => {
        this.frontService.alert.error(err.error.message);
      })
    }, (err: any) => {
      this.frontService.alert.error(err.error.message);
    });
  }
}

