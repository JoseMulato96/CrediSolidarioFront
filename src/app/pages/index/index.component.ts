import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AddressesUrlParams } from "../../parameters/addresses-url-params";

@Component({
  selector: "app-index",
  templateUrl: "./index.component.html",
  styleUrls: ["./index.component.scss"],
  providers: []
})
export class IndexComponent implements OnInit {
  showloading: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {}
}
