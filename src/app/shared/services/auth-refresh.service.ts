import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class AuthRefreshService {

  constructor() { }
  _timerActionOccured: Subject<void> = new Subject();
  get timerActionOccured(): Observable<void> { return this._timerActionOccured.asObservable() };

  notifyRunTimerRefreshToken() {
    this._timerActionOccured.next();
  }

  private _timeRefresh: number = 1

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Tiempo que debe conteo
   * @param timeExpires
   */
  public SetTimeRefresh(timeExpires: number) {
    this._timeRefresh = timeExpires / 60;
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Obtener el Tiempo
   */
  public GetTimeRefresh(): number {
    return this._timeRefresh;
  }

}
