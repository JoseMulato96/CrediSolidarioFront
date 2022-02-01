import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FormValidate, CustomValidators } from '@shared/util';
import { TranslateService } from '@ngx-translate/core';
import { masksPatterns } from '@shared/util/masks.util';
import { BeneficiariosFechaNacimientoConfig } from './beneficiario-lista-fecha-nacimiento.config';
import { SERVICIOS_PARAMETROS_BENEFICIARIO } from '@shared/static/constantes/servicios-parametros';
import { AppState } from '@core/store/reducers';
import { Store } from '@ngrx/store';
import { UrlRoute } from '@shared/static/urls/url-route';
import { SubmenuConfiguracion, ItemsSubMenuConfigure } from '@shared/components/mim-menu-vertical/mim-menu-vertical.component';
import { DataService } from '@core/store/data.service';
import { Acciones } from '@core/store/acciones';
import { Router, ActivatedRoute } from '@angular/router';
import { distinctUntilChanged } from 'rxjs/operators';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-beneficiario-lista-fecha-nacimiento',
  templateUrl: './beneficiario-lista-fecha-nacimiento.component.html',
})
export class BeneficiarioListarFechaNacimientoComponent extends FormValidate
  implements OnInit, OnDestroy {

  isForm: Promise<any>;
  form: FormGroup;
  subs: Subscription[] = [];
  patterns = masksPatterns;
  valorId = '';
  valorNombreApellido = '';

  configuracion: BeneficiariosFechaNacimientoConfig = new BeneficiariosFechaNacimientoConfig();

  constructor(private readonly formBuilder: FormBuilder,
    private readonly translate: TranslateService,
    private readonly store: Store<AppState>,
    private readonly dataService: DataService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit() {
    this.subs.push(this.store.select('menuPadreActivo')
      .subscribe((resp: any) => {
        this.configuracion.submenu =
          this.getMenu(resp.codeMenuPrimerNivel, resp.codeMenuPadreActivar);
      }),
      this.route.queryParams.subscribe(params => {
        this.onBuscarParams(params);
      }));
    this.initFormGroup();
  }

  private onBuscarParams(params: any) {
    if (params.criterio === '1') {
      this.valorId = params.palabra;
      this.configuracion.gridFechaNacimiento.pagina = params.pagina;
      this.getBeneficiarioInformacion(this.valorId, this.valorNombreApellido);
    } else if (params.criterio === '2') {
      this.valorNombreApellido = params.palabra;
      this.configuracion.gridFechaNacimiento.pagina = params.pagina;
      this.getBeneficiarioInformacion(this.valorId, this.valorNombreApellido);
    }
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

  onAtras(e) {
    this.getBeneficiarioInformacion(this.valorId, this.valorNombreApellido, e.pagina, e.tamano);
  }

  onSiguiente(e) {
    this.getBeneficiarioInformacion(this.valorId, this.valorNombreApellido, e.pagina, e.tamano);
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

  onClickLink(e) {
    this.dataService.beneficiarios().accion(Acciones.Publicar, e);

    const vista = [UrlRoute.PAGES,
    UrlRoute.CONSULTAS,
    UrlRoute.BENEFICIARIOS,
    UrlRoute.BENEFICIARIOS_FECHA_NACIMIENTO].join('/');

    this.router.navigate(
      [
        UrlRoute.PAGES,
        UrlRoute.CONSULTAS,
        UrlRoute.BENEFICIARIOS,
        UrlRoute.BENEFICIARIOS_FECHA_NACIMIENTO,
        e['codBeneficiario']
      ],
      {
        queryParams: {
          pagina: this.configuracion.gridFechaNacimiento.pagina,
          palabra: this.valorId || this.valorNombreApellido,
          criterio: this.valorId ? '1' : '2',
          vista: vista
        }
      }
    );
  }


  private initFormGroup(previous?: boolean) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        filtroId: [previous ? this.form.controls.filtroId.value : null],
        filtroNombreApellido: [previous ? this.form.controls.filtroNombreApellido.value : null]
      }));
    this.eventosControlFiltro();
  }

  private eventosControlFiltro() {
    this.form.controls.filtroId.valueChanges.pipe(distinctUntilChanged()).subscribe((value) => {
      if (value !== null && value !== '') {
        this.form.controls.filtroNombreApellido.disable();
      } else {
        this.form.controls.filtroNombreApellido.enable();
      }
    });
    this.form.controls.filtroNombreApellido.valueChanges.pipe(distinctUntilChanged()).subscribe((value) => {
      if (value !== null && value !== '') {
        this.form.controls.filtroId.disable();
      } else {
        this.form.controls.filtroId.enable();
      }
    });
  }


  ngOnDestroy() {
    (this.subs || []).forEach(x => x.unsubscribe());
    this.subs = undefined;
  }

  onLimpiarCampos() {
    this.form.reset();
    this.initFormGroup();

    // Limpiamos la grilla.
    this.configuracion.gridFechaNacimiento.component.limpiar();
  }

  onBuscar(event: any) {
    if (
      CustomValidators.CampoVacio(this.form.controls.filtroId.value) &&
      CustomValidators.CampoVacio(this.form.controls.filtroNombreApellido.value)
    ) {
      this.form.controls.filtroId.setErrors({ 'incorrect': true });
      this.form.controls.filtroNombreApellido.setErrors({ 'incorrect': true });
      this.validateForm(this.form);
      this.translate
        .get('beneficiarios.actualizar.alertas.datosRequeridos')
        .subscribe(async texto => {
          await this.frontService.alert.warning(texto);
        });
      return;
    } else {
      this.validateForm(this.form);
    }

    let valorId = this.form.controls.filtroId.value;
    let valorNombreApellido = this.form.controls.filtroNombreApellido.value;
    valorId = String(valorId || '').trim();
    valorNombreApellido = String(valorNombreApellido || '').trim();
    this.valorId = valorId;
    this.valorNombreApellido = valorNombreApellido;
    this.getBeneficiarioInformacion(valorId, valorNombreApellido);
  }

  private getBeneficiarioInformacion(identificacionParam: any, nombre: any, pagina = 0, tamano = 10) {
    const identificacion = identificacionParam;
    const nombreCompleto = nombre.replace(' ', '%');
    const option: any = { page: pagina, size: tamano, isPaged: true };

    if (identificacion) {
      option.identificacion = identificacion;
      option.estados = SERVICIOS_PARAMETROS_BENEFICIARIO.informacion.estadoId;
    } else {
      option.nombreCompleto = nombreCompleto;
      option.estados = SERVICIOS_PARAMETROS_BENEFICIARIO.informacion.estadoNombre;
    }

    this.backService.beneficiarios
      .getBeneficiariosInformacion(option)
      .subscribe((respuesta: any) => {
        this.configuracion.gridFechaNacimiento.component.limpiar();
        if (identificacionParam && (!respuesta || respuesta.content.length === 0)) {
          this.translate
            .get('global.noSeEncontraronRegistrosMensaje')
            .subscribe((response: any) => {
              this.frontService.alert.info(response);
            });
          return;
        }

        if (nombre && (!respuesta || !respuesta.content.length)) {
          this.translate
            .get('global.noSeEncontraronRegistrosMensaje')
            .subscribe((response: any) => {
              this.frontService.alert.info(response);
            });
          return;
        }

        this.configuracion.gridFechaNacimiento.component.cargarDatos(
          respuesta.content,
          {
            maxPaginas: respuesta.totalPages,
            pagina: respuesta.number,
            cantidadRegistros: respuesta.totalElements
          }
        );

        this.form.controls.filtroId.setValue(identificacionParam);
        this.form.controls.filtroNombreApellido.setValue(nombre);
      });
  }


}
