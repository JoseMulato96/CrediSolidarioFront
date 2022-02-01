import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bitacora',
  templateUrl: './bitacora.component.html'
})
export class BitacoraComponent implements OnInit, OnDestroy {

  _subs: Subscription[] = [];
  selectIndex = -1;
  idProceso: string;

  constructor
    (
      private readonly route: ActivatedRoute
    ) { }

  ngOnInit() {
    this._subs.push(this.route.params.subscribe((params) => {
      this.idProceso = params.idProceso;
    }));
  }

  ngOnDestroy() {
    this._subs.forEach(x => x.unsubscribe());
  }

  /**
  * @author Jorge Luis Caviedes Alvarado
  * @description selecionar la card con el borde narajado
  */
  _onClickCard(index: number, e: MouseEvent) {
    this.selectIndex = index;
    e.stopPropagation();
  }

}

