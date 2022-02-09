import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import {
  BaseComponent,
  BaseModel
} from "../../extends-components/base-component";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "s-tooltip",
  templateUrl: "./s-tooltip.component.html",
  styleUrls: ["./s-tooltip.component.scss"]
})
export class STooltipComponent extends BaseComponent implements OnInit {
  constructor() {
    super();
  }

  ngOnInit() {}

  Skeleton: TooltipModel;
}

export class TooltipModel extends BaseModel {}
