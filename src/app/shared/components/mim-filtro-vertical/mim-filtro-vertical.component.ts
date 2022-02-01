import { AfterContentInit, Component, ContentChildren, Input, QueryList, ViewChild, ElementRef, HostListener, OnInit } from '@angular/core';
import { MimFiltroVerticalItemComponent } from './mim-filtro-vertical-item/mim-filtro-vertical-item.component';

@Component({
  selector: 'app-mim-filtro-vertical',
  templateUrl: './mim-filtro-vertical.component.html',
  styleUrls: ['./mim-filtro-vertical.component.css']
})
export class MimFiltroVerticalComponent implements AfterContentInit, OnInit {

  @ContentChildren(MimFiltroVerticalItemComponent)
  filtroVerticalItems: QueryList<MimFiltroVerticalItemComponent>;
  @Input()
  // tslint:disable-next-line:no-use-before-declare
  configuracion: MimFiltroVerticalComponentConfig = new MimFiltroVerticalComponentConfig();
  filtroVerticalItemSeleccionado: MimFiltroVerticalItemComponent;
  configuracionFiltroVerticalItems: any[] = [];

  constructor(
    private readonly eRef: ElementRef
  ) {
  }

  @ViewChild('displayUl') displayUl: ElementRef;

  ngAfterContentInit(): void {
    const _childMenus = this.filtroVerticalItems.toArray();
    this.configuracionFiltroVerticalItems = [];
    _childMenus.forEach((x, index) => {
      this.configuracionFiltroVerticalItems.push({
        label: x.label, cssIcon: x.cssIcon, link: x.link
      });
    });

  }

  _onClickUp() {
    if (this.displayUl.nativeElement.children.length) { this.displayUl.nativeElement.scrollTop -= this.displayUl.nativeElement.children[0].offsetWidth; }
  }

  _onClickDown() {
    if (this.displayUl.nativeElement.children.length) { this.displayUl.nativeElement.scrollTop += this.displayUl.nativeElement.children[0].offsetWidth; }
  }

  ngOnInit() {
    this.configuracion.component = this;
    this.configuracion.items = this.configuracion.items || [];
  }

  _onCerrar() {
    this.filtroVerticalItems.toArray().forEach(x => x.ocultar());
    this.filtroVerticalItemSeleccionado = undefined;
  }

  _onOpen(item, e, index: number) {
    e.stopPropagation();
    const child: MimFiltroVerticalItemComponent = this.filtroVerticalItems.toArray()[index];

    if (this.filtroVerticalItemSeleccionado === child && !child.isOculto()) {
      return child.ocultar();
    }

    if (this.filtroVerticalItemSeleccionado) {
      this.filtroVerticalItemSeleccionado.ocultar();
    }

    this.filtroVerticalItemSeleccionado = child;
    if (child) {
      child.mostar();
    }
  }

  @HostListener('document:click', ['$event'])
  clickOut(event) {
    let contains = false;

    // Primero verificamos que el componente como tal tenga el elemento.
    if (this.eRef.nativeElement.contains(event.target)) {
      // Si lo contiene no cerramos el componente.
      return;
    }

    // Al parcer no es capaz de detectar si contiene algunos componentes que efectivamente estan en el componente.
    // Para estos casos realizamos la busqueda manualmente.
    contains = this.contieneElemento(this.eRef.nativeElement.children, event.target);


    // Si no lo contiene cerramos el componente.
    if (!contains) {
      this._onCerrar();
    }

  }

  private contieneElemento(children: any[], element: any) {
    let contains = false;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.isEqualNode(element)) {
        return true;
      } else {
        if (child.children && child.children.length > 0) {
          contains = this.contieneElemento(child.children, element);
          if (contains) {
            return true;
          }
        }
      }
    }

    return contains;
  }

}

export class MimFiltroVerticalComponentConfig {
  component?: MimFiltroVerticalComponent;
  items?: MimFiltroVerticalItemComponentConfig[] = [];
}

export class MimFiltroVerticalItemComponentConfig {
  label = '';
  link?: string[] = [];
  cssIcon = '';
  htmlId = '';
}
