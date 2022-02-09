import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import {
  BaseComponent,
  BaseModel
} from "../../extends-components/base-component";
import { HttpClient } from "@angular/common/http";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "s-location",
  templateUrl: "./s-location.component.html",
  styleUrls: ["./s-location.component.scss"]
})
export class SLocationComponent extends BaseComponent implements OnInit {
  //
  InputCountry: BaseModel = new BaseModel();

  InputDepartament: BaseModel = new BaseModel();

  InputCity: BaseModel = new BaseModel();

  _PatternMessage = "";

  Locations = [this.InputCountry, this.InputDepartament, this.InputCity];

  constructor(private http: HttpClient) {
    super();
  }

  ngOnInit() {
    this.InputCountry.Label = this.Skeleton.LabelCountry;
    this.InputDepartament.Label = this.Skeleton.LabelDepartament;
    this.InputCity.Label = this.Skeleton.LabelCity;
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description valid si hay que aplicacr el item store
   */
  ngAfterContentInit() {
    this.ApplyItemsStore(this.http);
    this.EvtLoadItemsByStore.subscribe(x => {});
  }

  Skeleton: LocationModel;
}

export class LocationModel extends BaseModel {
  LabelDepartament: string = "";
  LabelCity: string = "";
  LabelCountry: string = "";
  IsVisibleCountry: boolean = true;
  IsVisibleDepartament: boolean = true;
  IsVisibleCity: boolean = true;
}
