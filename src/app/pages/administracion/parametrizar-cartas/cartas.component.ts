import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cartas',
  templateUrl: './cartas.component.html'
})
export class CartasComponent implements OnInit {

  constructor(
    private readonly location: Location
  ) { }

  ngOnInit() {
    // do nothing
  }

  irAtras() {
    this.location.back();
  }

}
