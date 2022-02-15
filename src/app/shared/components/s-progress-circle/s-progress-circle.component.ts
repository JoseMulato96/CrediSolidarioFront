import { Component, OnInit } from "@angular/core";
import { BprogressCircleComponent } from "../../extends-components/bprogress-circle-component";
import { BaseModel } from "../../extends-components/base-component";

@Component({
  selector: "s-progress-circle",
  templateUrl: "./s-progress-circle.component.html",
  styleUrls: ["./s-progress-circle.component.scss"]
})
export class SProgressCircleComponent extends BprogressCircleComponent
  implements OnInit {
  constructor() {
    super();
  }

  /**
   * r
   * @description construye el la interfaz numero circulo
   */
  ngOnInit() {
    this.Skeleton.NumberProgress = this.Skeleton.NumberProgress || 0;
  }
  Skeleton: SProgressCircleModel = new SProgressCircleModel();
}

export class SProgressCircleModel extends BaseModel {
  public NumberProgress: number = 0;
}
