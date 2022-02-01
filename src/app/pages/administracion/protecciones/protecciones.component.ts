import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { Store } from '@ngrx/store';
import { AppState } from '@core/store/reducers';
import { SubmenuConfiguracion, ItemsSubMenuConfigure } from '@shared/components/mim-menu-vertical/mim-menu-vertical.component';
import { AuthenticationService } from '@core/services';

@Component({
  selector: 'app-protecciones',
  templateUrl: './protecciones.component.html',
  styleUrls: ['./protecciones.component.css']
})
export class ProteccionesComponent implements OnInit {
  configuracion: any;
  subs: Subscription[] = [];
  constructor(
    private readonly router: Router,
    private readonly store: Store<AppState>,
    private readonly auth: AuthenticationService ) { }

  ngOnInit() {
    this.subs.push(this.store.select('menuPadreActivo')
      .subscribe((resp: any) => {
        this.configuracion = this.getMenu(resp.codeMenuPrimerNivel, resp.codeMenuPadreActivar);
      }));
  }

  seleccionOpcion(router: string[]) {
    const url = router.join('/');
    this.router.navigateByUrl(url);
  }


  /**Obtenemos el menu lateral */
  getMenu(codMenuPrimerNivel, codMenu) {

    const subMenu = this.auth.getUser().menus
                  .filter(x => !!x.subMenus.find(t => t.appObject.code === 'MM_ADMIN_CONFIG'))[0].subMenus
                  .find(x => x.appObject.code === 'MM_ADMIN_CONFIG');

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
      itemsSubmenu.push(this.buildSm(list));
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

}
