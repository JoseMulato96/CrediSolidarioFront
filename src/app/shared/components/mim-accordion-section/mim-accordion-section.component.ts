import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FunctionUtil } from '@shared/util/function.util';

@Component({
  selector: 'app-mim-accordion-section',
  templateUrl: './mim-accordion-section.component.html',
  styleUrls: ['./mim-accordion-section.component.css']
})
export class MimAccordionSectionComponent implements OnInit {
  _id: string = FunctionUtil.GeneralId();
  @Input()
  // tslint:disable-next-line:no-use-before-declare
  configuracion: MimAccordionSectionConfiguration = new MimAccordionSectionConfiguration();

  constructor(private readonly translate: TranslateService) { }

  ngOnInit() {
    // do nothing
  }


  _onClickOpen() {
    this.configuracion._showAccordion = !this.configuracion._showAccordion;
  }

}
export class MimAccordionSectionConfiguration {
  title?: string = null;
  description?: string = null;
  collapsable?: boolean;
  _showAccordion = false;
}
