import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelacionFactoresCoberturaComponent } from './relacion-factores-cobertura.component';

describe('RelacionFactoresCoberturaComponent', () => {
  let component: RelacionFactoresCoberturaComponent;
  let fixture: ComponentFixture<RelacionFactoresCoberturaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelacionFactoresCoberturaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelacionFactoresCoberturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
