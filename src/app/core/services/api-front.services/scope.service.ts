import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ScopeService {

  constructor(private readonly auth: AuthenticationService) { }

  obtenerMenu(codigos: string[], raiz: boolean): any {
    // Creamos una copia del objeto para no modificar la referencia en memoria de codigos.
    const _codigos = JSON.parse(JSON.stringify(codigos));

    // Obtenemos los menus.
    const menus = this.auth.getUser().menus;

    // Buscamos el menu.
    let menu: any;
    // Si se trata del menu raiz entonces...
    if (raiz) {
      let _menus = menus.filter(_menu => _menu.appObject.root);
      // Ordenamos el menu.
      _menus = _menus.sort((a, b) => a.appObject.order - b.appObject.order);
      menu = {
        subMenus: _menus
      };
    } else {
      // Si no, realizamos la busqueda del submenu.
      menu = this._obtenerMenu(_codigos, menus);
    }

    return menu;
  }

  private _obtenerMenu(codigos: string[], menus: any[]) {
    // Obtenemos el primero de la lista de codigos.
    const codigo = codigos.shift();

    // Obtenemos el menu con el codigo en cuestion.
    let menu: any;
    for (const _menu of menus) {
      if (_menu.appObject.code.trim() === codigo) {
        menu = _menu;
        break;
      }
    }

    // Si aun tenemos un codigo seguimos buscando.
    if (menu && menu.subMenus.length > 0 && codigos.length > 0) {
      return this._obtenerMenu(codigos, menu.subMenus);
    } else if (menu && menu.subMenus.length === 0 && codigos.length > 0) {
      // Si menu es definido, no tiene submenus y aun hay codigos, debemos retornar null.
      // Esto se realiza para indicar que no fue posible encontrar un menu en el nivel solicitado.
      return null;
    }

    return menu;
  }

  /**
   *
   * @param permiso Codigo del permiso (operacion)
   * @param permisos Conjunto de permisos (operaciones)
   */
  tienePermisos(permiso: string, permisos: any[]): boolean {
    for (const _permiso of permisos) {
      if (_permiso.name.trim() === permiso) {
        return true;
      }
    }

    return false;
  }

  obtenerComponents(codigos: string): any {
    // Creamos una copia del objeto para no modificar la referencia en memoria de codigos.
    const _codigos = JSON.parse(JSON.stringify(codigos));

    // Obtenemos los menus.
    const components = this.auth.getUser().components;
    // Buscamos del component.
    return components.filter(x => x.parentCode === codigos)
      .sort((a, b) => a.order - b.order);
  }
}
