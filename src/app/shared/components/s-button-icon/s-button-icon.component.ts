import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { BButtonComponent } from "../../extends-components/bbutton-component";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "s-button-icon",
  templateUrl: "./s-button-icon.component.html",
  styleUrls: ["./s-button-icon.component.scss"]
})
export class SButtonIconComponent extends BButtonComponent implements OnInit {
  constructor() {
    super();
  }

  ngOnInit() {}
}
