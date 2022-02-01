import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer } from '@angular/forms';

@Component({
  selector: 'app-gestion-diaria-automatica',
  templateUrl: './gestion-diaria-automatica.component.html',
})

export class ConfiguracionGestionDiariaAutomaticaComponent implements OnInit {

  tieneSolicitudHija: boolean;
  tipoSolicitudes: any[];
  tipoSolicitudesHijas: any[];
  solicitudes: any[];
  fases: any[];
  tareas: any[];
  usuarioSolicitud: any;

  @Input('dataInit')
  set dataInit(value: any) {
    if (value) {
      this.tipoSolicitudes = value.tipoSolicitudes;
      this.tieneSolicitudHija = value.tieneSolicitudHija;
      this.tipoSolicitudesHijas = value.tipoSolicitudesHijas;
      this.solicitudes = value.solicitudes;
      this.fases = value.fases;
      this.tareas = value.tareas;
      this.usuarioSolicitud = value.usuarios;
    }
  }

  constructor(public controlContainer: ControlContainer) {
    this.tipoSolicitudes = [];
    this.tipoSolicitudesHijas = [];
    this.solicitudes = [];
    this.fases = [];
    this.tareas = [];
  }

  ngOnInit() {
    //do nothing
  }
}
