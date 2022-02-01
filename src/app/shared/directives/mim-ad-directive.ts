import { Directive, ViewContainerRef, Input } from '@angular/core';

@Directive({
  selector: '[appMimAdDirective]',
})
export class MimAdDirective {
  @Input()
  key: string;

  constructor(public viewContainerRef: ViewContainerRef) { }
}
