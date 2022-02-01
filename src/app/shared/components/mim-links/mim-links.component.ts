import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';


export class MimLinksConfiguracion {
  title = '';
  items?: MimLinkConfiguracion[] = [];
  collapsable = true;
  component?: MimLinksComponent;
}

export class MimLinkConfiguracion {
  label?: string;
  key?: string;
  url?: string[];
  urlParams?: any;
  customGoTo?: boolean;
  icon?: MimLinkIconConfiguracion;
}

export class MimLinkIconConfiguracion {
  icon: string;
  css?: string;
}

@Component({
  selector: 'app-mim-links',
  templateUrl: './mim-links.component.html'
})
export class MimLinksComponent implements OnInit, OnDestroy, AfterViewInit {

  @Output() customGoTo = new EventEmitter<any>();
  @Input()
  configuracion: MimLinksConfiguracion = new MimLinksConfiguracion();

  _id: string = String(Math.trunc(Math.random() * 1000));

  constructor() {
    // do nothing
  }

  ngOnInit() {
    // do nothing
  }

  ngOnDestroy() {
    // do nothing
  }

  ngAfterViewInit() {
    // do nothing
  }

  goTo(item: MimLinkConfiguracion) {
    if (item.customGoTo) {
      this.customGoTo.emit(item);
    } else {
      const href = document.location.href;
      let _url = item.url.join('/');
      _url = href.split('#')[0] + '#/' + _url;

      if (item.urlParams) {
        _url += '?';
        Object.keys(item.urlParams).forEach(opt => {
          _url += `${opt}=${item.urlParams[opt]}&`;
        });
      }

      window.open(_url, '', 'width=' + window.outerWidth + ',height=' + window.outerHeight + ',left=0,top=0');
    }
  }

}
