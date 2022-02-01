import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'app-mim-wind-modal',
  templateUrl: './mim-wind-modal.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./mim-wind-modal.component.css']
})
export class MimWindModalComponent implements OnInit {
  constructor(private readonly _el: ElementRef) {
    this._el.nativeElement.focus();
  }
  _show: boolean;

  @Input()
  // tslint:disable-next-line:no-use-before-declare
  configuracion: MimWindModalConfiguracion = new MimWindModalConfiguracion();

  // tslint:disable-next-line:no-output-rename
  @Output('click-btn-fooder')
  clickBtnFooder: EventEmitter<any> = new EventEmitter<any>();

  // tslint:disable-next-line:no-output-rename
  @Output('click-btn-close')
  clickBtnClose: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit() {
    if (!this.configuracion.component) {
      this.configuracion.component = this;
    }
  }

  mostrar() {
    this._show = true;
  }

  ocultar() {
    this._show = false;
  }


  _clickBtn(btn) {
    this.clickBtnFooder.emit(btn);
  }
  _clickBtnClose() {
    this.clickBtnClose.emit(this);
    if (this.configuracion.desabilitarBtnCerrar) {
      return;
    }
    this._show = false;
  }

  _clickModal(e) {
    if (this.configuracion.desabilitarCerrarModal) {
      return;
    }
    this._show = false;
  }

  _clickNoModal(e) {
    e.stopPropagation();
  }
}

export class MimWindModalConfiguracion {
  component?: MimWindModalComponent;
  autoCerrar = true;
  desabilitarCerrarModal = false;
  desabilitarBtnCerrar = false;
  ocultaBtnCerrar = false;
  titulo = '';
  buttons?: MinButtonConfiguracion[] = [];
  css?: string;
  iconCss = '';
  width?: any;
}

export class MinButtonConfiguracion {
  label = '';
  tag?: any = {};
}
