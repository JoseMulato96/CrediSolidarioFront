import { Component, Input, OnInit } from '@angular/core';
import { FunctionUtil } from '@shared/util/function.util';

@Component({
  selector: 'app-accordion-panel',
  templateUrl: './accordion-panel.component.html',
  styleUrls: ['./accordion-panel.component.css']
})
export class AccordionPanelComponent implements OnInit {

  constructor() {
    // do nothing
  }

  _id: string = FunctionUtil.GeneralId();
  _showAccordion = false;


  @Input()
  titulo = '';


  ngOnInit() {
    // do nothing
  }

  _onClickOpen() {
    this._showAccordion = !this._showAccordion;
  }

}

