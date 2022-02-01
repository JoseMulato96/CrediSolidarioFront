import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-mim-menu-vertical',
  templateUrl: './mim-menu-vertical.component.html',
  styleUrls: ['./mim-menu-vertical.component.css']
})
export class MimMenuVerticalComponent implements OnInit {

  /** Configuración principal de menus */
  @Input()
  // tslint:disable-next-line:no-use-before-declare
  configuracion: SubmenuConfiguracion = new SubmenuConfiguracion();

  /** Nos permite ocultar/mostrar el panel de submenus responsive */
  shownPanel = false;

  /** Copia de items de un item (Submenus) para pasarle por referencia al panel lateral de submenus responsive */
  // tslint:disable-next-line:no-use-before-declare
  subSubMenus: SubmenuConfiguracion = new SubmenuConfiguracion();

  /** Dispara eventos al hacer click en un item. Nota: Los eventos no se deben re nombrar. */
  @Output()
  clickItemEvent: EventEmitter<any> = new EventEmitter<any>();

  /** Subscripciones realizadas por el componente para hacer unsubscribe en el OnDestroy */
  _subs: Subscription[] = [];

  @ViewChild('displayUl')
  displayUl: ElementRef;

  constructor(
    private readonly router: Router,
    private readonly eRef: ElementRef) { }

  ngOnInit() {
    this._subs.push(
      this.router.events.subscribe(ruta => {
        if (ruta instanceof NavigationStart) {
          this.watcherUrl(ruta.url);
        }
      })
    );

    this.watcherUrl(this.router.url);
  }

  watcherUrl(url: string) {
    this._seleccionarItem(url, this.configuracion.items);
    this.closeSubmenusResponsivePanelLeft();
  }

  _seleccionarItem(url: string, items: ItemsSubMenuConfigure[]) {
    url = url.split('?')[0];
    let selecionar = false;
    items.forEach(item => {
      let urlValida = true;
      // Obtenemos los fragmentos de la URI.
      const _links = url.split('/');
      // Validamos contra el arreglo de fragmentos de URI los fragmentos configurados en el menu
      item.link.forEach(link => {
        if (!link.startsWith(':')) {
          urlValida = urlValida && (_links.indexOf(link) !== -1);
        }
      });

      selecionar = selecionar || urlValida;
      item.select = urlValida;
      item.show = urlValida;
      if (item.items && item.items.length) {
        selecionar = this._seleccionarItem(url, item.items);
        item.select = selecionar;
        item.show = selecionar;
      }
    });
    return selecionar;
  }

  ngDelete() {
    this._subs.forEach(subs => subs.unsubscribe());
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description escucha el item
   */
  _onClickItem(
    selectItem: ItemsSubMenuConfigure,
    parentItem?: ItemsSubMenuConfigure) {
    let router: string[] = [];

    if (selectItem.items && selectItem.items.length) {
      selectItem.show = !selectItem.show;

      if (!selectItem.show) {
        return;
      }
    }

    if (selectItem) {
      router = selectItem.link;
    }

    if (parentItem) {
      router = parentItem.link.concat(selectItem.link);
    }

    if (!selectItem.noClick) {
      this.clickItemEvent.emit(router);
    }
  }

  _onClickUp() {
    if (this.displayUl.nativeElement.children.length) {
      this.displayUl.nativeElement.scrollTop -= this.displayUl.nativeElement.children[0].offsetWidth;
    }
  }
  _onClickDown() {
    if (this.displayUl.nativeElement.children.length) {
      this.displayUl.nativeElement.scrollTop += this.displayUl.nativeElement.children[0].offsetWidth;
    }
  }

  openSubmenusResponsivePanelLeft(item: any) {
    // Si tiene sub menus abrimos el panel de submenus responsive
    if (item.items && item.items.length > 0) {
      // Realizamos la copia del objeto para renderizar el HTML
      this.subSubMenus.items = item.items;

      // Si tiene enlaces entonces realizamos la copia de enlaces.
      if (item.link && item.link.length) {
        const linkMenuPrincipal = { ...item.link };
        this.subSubMenus.items = item.items.map(x => {
          const direccion = Object.values(linkMenuPrincipal);
          direccion.push(x.link[0]);
          return { ...x, link: direccion };
        });
      }

      // Configuramos el estado del item seleccionado.
      item.select = true;

      // Abrimos el panel de submenus responsive
      this.shownPanel = true;
    } else {
      // Si se trata de un item sin submenus disparamos el evento _onCLickItem
      this._onClickItem(item);
    }
  }

  closeSubmenusResponsivePanelLeft() {
    this.shownPanel = false;
  }

  @HostListener('document:click', ['$event'])
  clickOut(event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.closeSubmenusResponsivePanelLeft();
    }
  }
}

export class SubmenuConfiguracion {
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description titulo de submenu
   */
  titulo?: string;
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description items del menu que se va mostrar
   */
  items?: ItemsSubMenuConfigure[] = [];
}

export class ItemsSubMenuConfigure {
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description titulo de item a mostrar
   */
  titulo ? = '';

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description action o link que le corresponde al item
   */
  link?: string[] = [];

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description subitems
   */
  items?: ItemsSubMenuConfigure[] = [];

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description css que contiene el icon del item
   */
  iconCss?: string;

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description muestra u oculta los hijos
   */
  show ? = false;

  select ? = false;

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description no permitir evento click para notificar
   */
  noClick ? = false;
}
