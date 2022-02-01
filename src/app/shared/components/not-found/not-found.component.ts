import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html'
})
export class NotFoundComponent implements OnInit {
  constructor(private readonly location: Location, private readonly router: Router) { }

  ngOnInit() {
    // do nothing
  }

  goHome() {
    this.router.navigate(['/']);
  }
  goBack() {
    this.location.back();
  }
}
