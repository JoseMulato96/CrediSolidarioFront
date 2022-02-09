import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import {
  BinputComponent,
  InputModel
} from "../../extends-components/binput-component";

@Component({
  selector: "s-area-text",
  templateUrl: "./s-area-text.component.html",
  styleUrls: ["./s-area-text.component.scss"]
})
export class SAreaTextComponent extends BinputComponent implements OnInit {
  constructor(public http: HttpClient) {
    super(http);
  }

  ngOnInit() {}
}

export class AreaTextModel extends InputModel {}
