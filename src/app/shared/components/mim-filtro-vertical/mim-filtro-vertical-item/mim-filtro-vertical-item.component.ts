import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-mim-filtro-vertical-item',
  templateUrl: './mim-filtro-vertical-item.component.html',
  styleUrls: ['./mim-filtro-vertical-item.component.css']
})
export class MimFiltroVerticalItemComponent implements OnInit {

  @Input()
  label = '';

  @Input()
  cssIcon = '';

  @Input()
  link = '';

  _cssShow = false;

  constructor() {
    // do nothing
  }

  ngOnInit() {
    // do nothing
  }

  mostar() {
    this._cssShow = true;
  }


  ocultar() {
    this._cssShow = false;
  }

  isOculto() {
    return !this._cssShow;
  }

  isMostrar() {
    return this._cssShow;
  }

}
