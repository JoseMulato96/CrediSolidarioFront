import { Component, OnInit } from '@angular/core';
import { UrlRoute } from '@shared/static/urls/url-route';

@Component({
  selector: 'app-configuracion-seguridad',
  templateUrl: './configuracion-seguridad.component.html',
  styleUrls: ['./configuracion-seguridad.component.css']
})
export class ConfiguracionSeguridadComponent implements OnInit {
  urlLogNovedade: string = UrlRoute.ADMINISTRACION_CONFIGURACION_SEGURIDAD_LOG_NOVEDADES;
  urlAuditoria: string = UrlRoute.ADMINISTRACION_CONFIGURACION_SEGURIDAD_AUDITORIA;
  constructor() {
    // do nothing
  }

  ngOnInit() {
    // do nothing
  }

}
