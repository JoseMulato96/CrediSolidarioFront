import { EventEmitter, Injectable } from "@angular/core";

@Injectable()
export class NotificationsAppService {
  constructor() {}

  ensablePage: EventEmitter<any> = new EventEmitter<any>();
  UpdateFiles2: EventEmitter<any> = new EventEmitter<any>();
  UpdateFiles: EventEmitter<any> = new EventEmitter<any>();
  ValidateBtnContinue: EventEmitter<any> = new EventEmitter<any>();
  MenuItemClick: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description notifica que se a cabado el token
   */
  ExpiredToken: EventEmitter<any> = new EventEmitter<any>();
}
