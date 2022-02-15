import { HttpClient } from "@angular/common/http";
import {
  Component,
  ElementRef,
  OnInit,
  ViewEncapsulation
} from "@angular/core";
import {
  BinputComponent,
  InputEnum
} from "../../extends-components/binput-component";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "s-input",
  templateUrl: "./s-input.component.html",
  styleUrls: ["./s-input.component.scss"]
})
export class SInputComponent extends BinputComponent implements OnInit {

  constructor(public http: HttpClient, private el: ElementRef) {
    super(http);
  }

  ngAfterContentInit() {
    super.ngAfterContentInit();
  }

  /**
   * r
   * @description valida si el tipo de componente es fecha para que solo funcione con la fecha
   */
  ngAfterViewInit() {
    /* if (this._Type == InputEnum.Date) {
       let inputElements = this.el.nativeElement;
       let inputEl = inputElements.getElementsByTagName("input");
       if (inputEl) {
         inputEl[0].onkeypress = () => {
           return false;
         };
         inputEl[0].onkeydown = () => {
           return false;
         };
       }
     }*/
  }
}
