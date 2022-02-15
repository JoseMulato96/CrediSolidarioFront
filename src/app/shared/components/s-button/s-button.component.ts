import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { BButtonComponent } from "../../extends-components/bbutton-component";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "s-button",
  templateUrl: "./s-button.component.html",
  styleUrls: ["./s-button.component.scss"]
})
export class SButtonComponent extends BButtonComponent implements OnInit {
  constructor() {
    super();
  }

  ngOnInit() {}

  iconCls: string = "";

  /**
   * r
   * @description escucha el click del botoon y dispara el evento o valida que este dispobible y no disable
   */
  OnClick() {
    if (this.Skeleton.Disable) {
      return;
    }
    super.OnClick();
  }
}
