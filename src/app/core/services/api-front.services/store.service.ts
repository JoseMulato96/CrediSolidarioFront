import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  tipoAsegurado: any;

  constructor(private readonly http: HttpClient, private readonly store: Store<any>) {}

  getAllState() {
    return this.store.select('appReducer');
  }

  updateAppState(obj) {
    this.store.dispatch({
      type: obj.action,
      payload: obj.payload,
    });
  }

  getTipoAsegurado() {
    return localStorage.getItem('tipoAsegurado');
  }

  setTipoAsegurado(tipoAsegurado: any) {
    localStorage.setItem('tipoAsegurado', tipoAsegurado);
  }

}
