import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class EventoAsociadosService {
  constructor() {
    // do nothing
  }

  private readonly eventoAtras = new Subject<any>();
  private readonly eventoMenu = new Subject<any>();

  atras() {
    return this.eventoAtras;
  }

  summenu() {
    return this.eventoMenu;
  }
}
