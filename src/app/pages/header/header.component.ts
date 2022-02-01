import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormValidate, CustomValidators } from '@shared/util';
import { Subscription } from 'rxjs';
import { UrlRoute } from '@shared/static/urls/url-route';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { masksPatterns } from '@shared/util/masks.util';
import { Store } from '@ngrx/store';
import { AppState } from '@core/store/reducers';
import { SetMenuPadre } from './menu-principal.accions';
import { DataService } from '@core/store/data.service';
import { Acciones } from '@core/store/acciones';
import { FrontFacadeService, BackFacadeService, StoreService } from '@core/services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent extends FormValidate implements OnInit, OnDestroy {
  shownPanel = false;
  objMenu = [];
  itemMenu = [];
  itemSubmenu = [];
  shownPanelRadicaciones = false;

  form: FormGroup;
  asociadoSubscription: Subscription;
  patterns = masksPatterns;

  usuario: any;
  subscription: Subscription = new Subscription();
  codMenuPadre: string;
  nombreMenuPadre: string;

  mostralModalReclamacion: boolean;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly translate: TranslateService,
    private readonly dataService: DataService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService,
    private readonly store: Store<AppState>,
    private readonly storeService: StoreService,
  ) {
    super();
  }

  ngOnInit() {
    this.subscription = this.store.select('menuPadreActivo')
      .subscribe((resp: any) => {
        this.codMenuPadre = resp.codMenuPadre;
        this.nombreMenuPadre = resp.nombreMenuPadre;
      });

    this.usuario = this.frontService.authentication.getUser();
    this.getMenu();
    this.form = this.formBuilder.group({
      asoNitCli: [''],
      nombreAsociado: ['']
    });

  }

  createSubMenu(idParent) {
    this.itemSubmenu = [];

    const itemArraySubmenu = this.itemMenu.filter(x => x.appObject.code === idParent)
      .map(x => x.subMenus)[0]
      .map(x => x.appObject)
      .sort((a, b) => a.order - b.order);
    const totalSubmenus = itemArraySubmenu.length;
    if (totalSubmenus > 5) {
      const porColumna = Math.round(totalSubmenus / 3);
      this.itemSubmenu[0] = itemArraySubmenu.slice(0, porColumna);
      this.itemSubmenu[1] = itemArraySubmenu.slice(porColumna, porColumna * 2);
      this.itemSubmenu[2] = itemArraySubmenu.slice(
        porColumna * 2,
        itemArraySubmenu.length + 1
      );
    } else {
      this.itemSubmenu[0] = itemArraySubmenu;
    }
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description escucha el boton de cerrar y cerrar el modal
   */
  activePanelRightRadicaciones(status: boolean) {
    this.shownPanelRadicaciones = status;
    this.shownPanel = status;

    if (!status) {
      this.form.reset();
    }
  }

  formConsultaRadicaciones() {
    // do nothing
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description escucha el boton para abrir la consulta
   */
  activePanelRight(status: boolean) {
    this.shownPanel = status;
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description valida los campos
   */
  onConsultarAsociados() {
    if (CustomValidators.CampoVacio(this.form.controls.asoNitCli.value) &&
      CustomValidators.CampoVacio(this.form.controls.nombreAsociado.value)) {
      this.validateForm(this.form);
      this.translate
        .get('global.validateForm')
        .subscribe((response: string) => {
          this.frontService.alert.warning(response);
        });
      return;
    }

    const nitCli = this.form.controls.asoNitCli.value;
    const nombre = this.form.controls.nombreAsociado.value;

    if (nitCli !== undefined && nitCli !== null && nitCli.trim().length !== 0) {
      this.backService.asociado.buscarAsociado({ nitCli, isPaged: true, page: 0, size: 100 }).subscribe((respuesta: any) => {
        if (!respuesta.content || respuesta.content.length === 0) {
          this.translate
            .get('asociado.noSeEncontraronRegistrosMensaje')
            .subscribe((response: string) => {
              this.frontService.alert.info(response);
            });
          return;
        }
        //Validamos si llegan mas de un asegurado para entonces llevar a la pantalla de consulta asegurado
        //Donde se seleccionara de que manera se decea ver la informacion de este
        if (respuesta.content.length > 1) {
          this.router
            .navigate([UrlRoute.PAGES, UrlRoute.CONSULTAS, UrlRoute.CONSULTA_ASOCIADOS], {
              queryParams: {
                nitCli: nitCli || '', p: 0
              }
            })
            .then(x => {
              this.activePanelRight(false);
              this.form.reset();
            });
        }
        else {
          const datosAsociado = respuesta.content[0];
          this.storeService.setTipoAsegurado(datosAsociado.tipoAsociado);
          // Agregamos loa datos al data service.
          this.dataService.asociados().accion(Acciones.Publicar, datosAsociado, false);

          if (this.form.get('asoNitCli').value) {
            this.activePanelRightRadicaciones(false);
            this.router.navigate([
              UrlRoute.PAGES,
              UrlRoute.CONSULTAS,
              UrlRoute.CONSULTAS_ASOCIADO,
              datosAsociado.numInt,
              UrlRoute.CONSULTAS_ASOCIADO_DATOS_ASOCIADO
            ]);
          }
        }
      }, (err: any) => {
        this.frontService.alert.error(err.error.message);
      });
    }
    else {
      if (nombre.length > 2) {
        this.router
          .navigate([UrlRoute.PAGES, UrlRoute.CONSULTAS, UrlRoute.CONSULTA_ASOCIADOS], {
            queryParams: {
              frase: nombre || '', p: 0
            }
          })
          .then(x => {
            this.activePanelRight(false);
            this.form.reset();
          });
      } else {
        this.translate.get('global.minCarateresBusqueda', { min: '3' }).subscribe((response: string) => {
          this.frontService.alert.warning(response);
        });
        return;
      }
    }
  }

  /**
   *
   * @description Realiza cierre de sesion.
   * @return null
   */
  logout() {
    this.frontService.authentication.logout();
    this.router.navigate(['login']);
  }

  getMenu() {
    this.itemMenu = this.usuario.menus.filter(x => x.appObject.root === true);
    this.itemMenu.sort((a, b) => a.appObject.order - b.appObject.order);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  _onClick(objMenu: any, event) {
    this.router.navigate([objMenu.action]);

    for (let i = 0; i <= this.itemMenu.length; i++) {
      document.getElementById(`#itemPrincipal${i}`).classList.remove('active-menu-principal');
    }

    event.path[0].classList.add('active-submenu-principal');
    this.store.dispatch(new SetMenuPadre(objMenu.code, objMenu.name, objMenu.parentCode));

  }

  modalReclamaciones() {
    this.mostralModalReclamacion = !this.mostralModalReclamacion;
  }

  datosForm(event: any) {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.CONSULTAS,
      UrlRoute.CONSULTAS_EVENTOS,
      UrlRoute.CONSULTAS_EVENTOS_CONSULTA
    ],
      {
        queryParams: {
          valor: event.liquidacion ? event.liquidacion : event.identificacion,
          tipo: event.tipoFiltro,
          radicacion: event.radicacion
        }
      });
  }
}
