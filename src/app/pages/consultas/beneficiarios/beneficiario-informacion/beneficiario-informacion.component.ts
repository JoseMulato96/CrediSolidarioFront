import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Acciones } from '@core/store/acciones';
import { DataService } from '@core/store/data.service';
import { TranslateService } from '@ngx-translate/core';
import { SERVICIOS_PARAMETROS_BENEFICIARIO } from '@shared/static/constantes/servicios-parametros';
import { UrlRoute } from '@shared/static/urls/url-route';
import { FormValidate, CustomValidators } from '@shared/util';
import { masksPatterns } from '@shared/util/masks.util';
import { BeneficiariosInformacionConfig } from './beneficiarios-informacion.config';
import { Store } from '@ngrx/store';
import { AppState } from '@core/store/reducers';
import { Subscription } from 'rxjs/internal/Subscription';
import { SubmenuConfiguracion, ItemsSubMenuConfigure } from '@shared/components/mim-menu-vertical/mim-menu-vertical.component';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-beneficiario-informacion',
  templateUrl: './beneficiario-informacion.component.html',
  styleUrls: ['./beneficiario-informacion.component.css']
})
export class BeneficiarioInformacionComponent extends FormValidate
  implements OnInit, OnDestroy {
  switchFiltro = 1;
  valorId = '';
  valorNombreApellido = '';
  form: FormGroup;
  isForm: Promise<any>;
  patterns = masksPatterns;
  configuracion: BeneficiariosInformacionConfig = new BeneficiariosInformacionConfig();
  subs: Subscription[] = [];

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly translate: TranslateService,
    private readonly router: Router,
    private readonly dataService: DataService,
    private readonly route: ActivatedRoute,
    public activatedRoute: ActivatedRoute,
    private readonly store: Store<AppState>,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService) {
    super();
  }

  ngOnInit() {
    this.subs.push(this.store.select('menuPadreActivo')
      .subscribe((resp: any) => {
        this.configuracion.submenu = this.getMenu(resp.codeMenuPrimerNivel, resp.codeMenuPadreActivar);
      }),

      this.route.queryParams.subscribe(params => {
        this._onBuscarParams(params);
      }));
    this.dataService.beneficiarios().accion(Acciones.Borrar, {});
    this._initFormGroup();
  }

  ngOnDestroy() {
    (this.subs || []).forEach(x => x.unsubscribe());
    this.subs = undefined;
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Inicializa el form group.
   */
  _initFormGroup(previous?: boolean) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        filtroId: new FormControl(previous ? this.form.controls.filtroId.value : null),
        filtroNombreApellido: new FormControl(previous ? this.form.controls.filtroNombreApellido.value : null)
      }));
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description limpia los campos
   */
  _onLimpiarCampos() {
    this.form.reset();
    this._initFormGroup();

    // Limpiamos la grilla.
    this.configuracion.gridInformacion.component.limpiar();
  }

  _onBuscarParams(params: any) {
    if (params.criterio === '1') {
      this.valorId = params.palabra;
      this.configuracion.gridInformacion.pagina = params.pagina;
      this.getBeneficiarioInformacion();
    } else if (params.criterio === '2') {
      this.valorNombreApellido = params.palabra;
      this.configuracion.gridInformacion.pagina = params.pagina;
      this.getBeneficiarioInformacion();
    }
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description escucha cuando la hace click al boton atras
   */
  onAtras(e) {
    this.getBeneficiarioInformacion();
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description escucha cuando la hace click al boton siguiente
   */
  onSiguiente(e) {
    this.getBeneficiarioInformacion();
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description escucha cuando hace click
   */
  onClickLink(e) {
    this.dataService.beneficiarios().accion(Acciones.Publicar, e);

    const vista = [UrlRoute.PAGES,
    UrlRoute.CONSULTAS,
    UrlRoute.BENEFICIARIOS,
    UrlRoute.BENEFICIARIOS_INFORMACION].join('/');

    this.router.navigate(
      [
        UrlRoute.PAGES,
        UrlRoute.CONSULTAS,
        UrlRoute.BENEFICIARIOS,
        UrlRoute.BENEFICIARIOS_INFORMACION,
        e['codBeneficiario'],
        UrlRoute.BENEFICIARIOS_ASOCIADO_RELACIONADOS
      ],
      {
        queryParams: {
          pagina: this.configuracion.gridInformacion.pagina,
          palabra: this.valorId || this.valorNombreApellido,
          criterio: this.valorId ? '1' : '2',
          vista: vista
        }
      }
    );
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description obtener los valores para hacer la peticion
   */
  _onBuscar(event: any) {
    // Usamos los custom validators debido a que no hay manera de hacerlos excluyentes desde
    // los formularios rectivos.
    if (
      CustomValidators.CampoVacio(this.form.controls.filtroId.value) &&
      CustomValidators.CampoVacio(this.form.controls.filtroNombreApellido.value)
    ) {
      this.form.controls.filtroId.setErrors({ 'incorrect': true });
      this.form.controls.filtroNombreApellido.setErrors({ 'incorrect': true });
      this.validateForm(this.form);
      this.translate
        .get('global.validateForm')
        .subscribe(async texto => {
          await this.frontService.alert.warning(texto);
        });
      return;
    } else {
      this._initFormGroup(true);
      this.validateForm(this.form);
    }

    let valorId = this.form.controls.filtroId.value;
    let valorNombreApellido = this.form.controls.filtroNombreApellido.value;
    valorId = String(valorId || '').trim();
    valorNombreApellido = String(valorNombreApellido || '').trim();

    this.valorId = valorId;
    this.valorNombreApellido = valorNombreApellido;
    this.getBeneficiarioInformacion();
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description seleciona el el sub menu
   */
  seleccionOpcion(router: string[]) {
    const url = router.join('/');
    this.router.navigateByUrl(url);
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Obtener los beneficiario de informacion
   */
  private getBeneficiarioInformacion() {
    const page: any = this.configuracion.gridInformacion.pagina;
    const size: any = this.configuracion.gridInformacion.tamano;
    const identificacion = this.valorId;
    const nombreCompleto = this.valorNombreApellido.replace(' ', '%');
    const option: any = { page, size };

    if (identificacion) {
      option.identificacion = identificacion;
      option.estados = SERVICIOS_PARAMETROS_BENEFICIARIO.informacion.estadoId;
    } else {
      option.nombreCompleto = nombreCompleto;
      option.estados =
        SERVICIOS_PARAMETROS_BENEFICIARIO.informacion.estadoNombre;
    }
    this.backService.beneficiarios
      .getBeneficiariosInformacion(option)
      .subscribe((respuesta: any) => {
        this.configuracion.gridInformacion.component.limpiar();
        if (this.valorId && (!respuesta || respuesta.content.length === 0)) {
          this.translate
            .get('beneficiarios.informacion.noExisteBeneficiarioInformacion')
            .subscribe((response: any) => {
              this.frontService.alert.info(response);
            });
          return;
        }

        if (this.valorNombreApellido && (!respuesta || !respuesta.content.length)) {
          this.translate
            .get('beneficiarios.informacion.noExisteNombreBeneficiarioInformacion')
            .subscribe((response: any) => {
              this.frontService.alert.info(response);
            });
          return;
        }

        this.configuracion.gridInformacion.component.cargarDatos(
          respuesta.content,
          {
            maxPaginas: respuesta.totalPages,
            pagina: respuesta.number,
            cantidadRegistros: respuesta.totalElements
          }
        );

        this.form.controls.filtroId.setValue(this.valorId);
        this.form.controls.filtroNombreApellido.setValue(this.valorNombreApellido);
      }, (err: any) => {
        this.frontService.alert.error(err.error.message);
      });
  }

  /**Obtenemos el menu lateral */
  getMenu(codMenuPrimerNivel, codMenu) {

    let subMenu = this.frontService.authentication.getUser().menus
      .filter(x => x.appObject.code.trim() === UrlRoute.CODE_MENU_CONSULTA.trim())
      .map(x => x.subMenus);
    if (subMenu.length > 0) {
      subMenu = subMenu[0].filter(x => x.appObject.code.trim() === UrlRoute.CODE_MENU_BENEFICIARIO.trim());
    }
    const submenus: SubmenuConfiguracion = new SubmenuConfiguracion();
    submenus.titulo = 'Consultas';
    submenus.items = this.buildSubmenu(subMenu);
    return submenus;
  }

  /**Recorremos el json obtenido del menu */
  buildSubmenu(listSubmenus: any) {
    const itemsSubmenu: ItemsSubMenuConfigure[] = [];
    for (const list of listSubmenus) {
      for (const items of list.subMenus) {
        itemsSubmenu.push(this.buildSm(items));
      }

    }
    return itemsSubmenu;
  }

  /**Construimos el submenu para el componente  */
  buildSm(items) {
    const itemsSM: any[] = [];
    const linkTop = items.appObject.action.substr(1).split('/');
    let noClick = false;
    let iconCss = '';
    if (items.subMenus.length > 0) {
      linkTop.pop();
      noClick = true;
      iconCss = 'icon-user-check';
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
    return {
      titulo: items.appObject.name,
      link: linkTop,
      items: itemsSM,
      noClick: noClick,
      iconCss: iconCss
    };
  }



}
