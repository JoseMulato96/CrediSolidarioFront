import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@core/services';
import { AppState } from '@core/store/reducers';
import { Store } from '@ngrx/store';
import { ItemsSubMenuConfigure, SubmenuConfiguracion } from '@shared/components/mim-menu-vertical/mim-menu-vertical.component';
import { UrlRoute } from '@shared/static/urls/url-route';
import { Subscription } from 'rxjs/internal/Subscription';
import { BeneficiariosInformacionConfig } from './beneficiario-informacion/beneficiarios-informacion.config';

@Component({
  selector: 'app-beneficiarios',
  templateUrl: './beneficiarios.component.html',
  styleUrls: ['./beneficiarios.component.css']
})
export class BeneficiariosComponent implements OnInit, OnDestroy {

  configuracion: BeneficiariosInformacionConfig = new BeneficiariosInformacionConfig();
  subscription: Subscription = new Subscription();
  @ViewChild('displayUl') displayUl: ElementRef;
  subSubMenus: SubmenuConfiguracion = new SubmenuConfiguracion();
  shownPanel = 0;
  constructor(
    private readonly router: Router,
    private readonly store: Store<AppState>,
    private readonly auth: AuthenticationService) { }

  ngOnInit() {
    this.subscription = this.store.select('menuPadreActivo')
      .subscribe((resp: any) => {
        this.configuracion.submenu = this.getMenu(resp.codeMenuPrimerNivel, resp.codeMenuPadreActivar);
      });
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description seleciona el el sub menu
   */
  seleccionOpcion(router: string[]) {
    const url = router.join('/');
    this.router.navigateByUrl(url);
  }

  /**Obtenemos el menu lateral */
  getMenu(codMenuPrimerNivel, codMenu) {

    let subMenu = this.auth.getUser().menus
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
    const iconCss = items.appObject.image;
    if (items.subMenus.length > 0) {
      // linkTop.pop()
      noClick = true;
      // iconCss = "icon-user-check"
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
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  _onClickUp() {
    if (this.displayUl.nativeElement.children.length) { this.displayUl.nativeElement.scrollTop -= this.displayUl.nativeElement.children[0].offsetWidth; }
  }

  _onClickDown() {
    if (this.displayUl.nativeElement.children.length) {
      this.displayUl.nativeElement.scrollTop += this.displayUl.nativeElement.children[0].offsetWidth;
    }
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
      const url = router.join('/');
      this.router.navigateByUrl(url);
      this.goToPanelLeftClose();
    }
  }

  goToPanelLeftClose() {
    this.shownPanel = 0;
  }
}
