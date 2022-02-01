import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-panel-right',
  templateUrl: './panel-right.component.html'
})
export class PanelRightComponent implements OnInit {
  constructor(private readonly router: Router) { }

  ngOnInit() {
    // do nothing
  }

  irBitacoraAcciones() {
    this.router.navigate(['/pages', 'bitacoras-de-acciones']);
  }
}
