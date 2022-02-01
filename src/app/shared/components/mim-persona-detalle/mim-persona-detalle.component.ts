import {
  AfterViewInit, Component, ComponentFactoryResolver, Input, OnDestroy, OnInit, QueryList, Type, ViewChildren
} from '@angular/core';
import { MimAdDirective } from '@shared/directives/mim-ad-directive';
import { AdComponent } from '@shared/interfaces/ad-component.interface';
import { ObjectUtil } from '@shared/util/object.util';

export class MimPersonaDetalleConfiguracion {
  title = '';
  items?: MimDatoPersonDetalleConfig[] = [];
  footer?: MimFooterPersonaDetalleConfig;
  collapsable = true;
  component?: MimPersonaDetalleComponent;
}

export class MimDatoPersonDetalleConfig {
  label?: string;
  key?: string;
  value?: string;
  icon?: MimIconPersonaDetalleConfig;
}

export class MimIconPersonaDetalleConfig {
  component: Type<any>;
  configuracion: any;
}

export class MimFooterPersonaDetalleConfig {
  title = '';
  link: any[] = [];
}

@Component({
  selector: 'app-mim-persona-detalle',
  templateUrl: './mim-persona-detalle.component.html',
  styleUrls: ['./mim-persona-detalle.component.css']
})
export class MimPersonaDetalleComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input()
  configuracion: MimPersonaDetalleConfiguracion = new MimPersonaDetalleConfiguracion();

  @ViewChildren(MimAdDirective)
  appMimAdDirectives: QueryList<MimAdDirective>;

  _datos: MimDatoPersonDetalleConfig[] = [];
  _id: string = String(Math.trunc(Math.random() * 1000));

  constructor(
    private readonly componentFactoryResolver: ComponentFactoryResolver
  ) { }

  ngOnInit() {
    if (!this.configuracion.component) {
      this.configuracion.component = this;
    }

    this.atualizarDatos({});
  }

  ngOnDestroy() {
    // do nothing
  }

  ngAfterViewInit() {
    // do nothing
  }

  /**
  * @author Jorge Luis Caviedes Alvarado
  * @description funcion publica para cargar los datos
  */
  cargarDatos(dato: any) {
    this.atualizarDatos(dato);
  }

  /**
  * @author Jorge Luis Caviedes Alvarado
  * @description actualiza los datos para ser mostrado en la aplicación
  */
  private atualizarDatos(valores: any) {
    this._datos = [];
    // Configuraos los items.
    for (let index = 0; index < this.configuracion.items.length; index++) {
      const x = this.configuracion.items[index];
      this._datos.push({
        key: x.key,
        label: x.label,
        value: x.value || (this._asignarValor(valores, x.key) || '')
      });
    }

    // Configuramos los componentes adicionales. Debemos asegurarnos que este codigo
    // Se ejecute una vez se haya construido el DOM.
    for (let index = 0; index < this.configuracion.items.length; index++) {
      const x = this.configuracion.items[index];
      setTimeout(() => {
        this.loadItemComponent(x);
      });
    }

  }

  _asignarValor(valor: any, item: any) {
    if (item && item.includes('.')) {
      let obj: object;
      for (const _columnaKey of item.split('.')) {
        obj = obj === undefined || obj === null ? valor[_columnaKey] : obj[_columnaKey];
      }
      return obj !== undefined && obj !== null ? String(obj) : '';
    }
    return valor[item];
  }

  /**
  * @author Jorge Luis Caviedes Alvarado
  * @description copia enviado en el porta papeles
  */
  _onClickCopiar(text: any) {
    ObjectUtil.copiarAlClipboard(text);
  }


  loadItemComponent(item: MimDatoPersonDetalleConfig) {
    if (!item.icon || !item.icon.component) {
      return;
    }

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(item.icon.component);
    this.appMimAdDirectives.forEach((adDirective: any) => {
      if (adDirective.key !== item.key) {
        return;
      }

      const viewContainerRef = adDirective.viewContainerRef;
      viewContainerRef.clear();

      const componentRef = viewContainerRef.createComponent(componentFactory);
      (<AdComponent>componentRef.instance).configuracion = item.icon.configuracion;
    });
  }

  toggle(mode: boolean) {
    this.configuracion.collapsable = mode;
  }

  irADatosEvento() {
    const paths = this.configuracion.footer.link;
    const urlFull = document.location.href;
    const url = paths.join('/');
    const urlNew = urlFull.split('#')[0] + '#/' + url;
    window.open(urlNew, '', 'width=' + window.outerWidth + ',height=' + window.outerHeight + ',left=0,top=0');
  }

}
