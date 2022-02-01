import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CotizarProteccionComponent } from './cotizar-proteccion.component';

describe('CotizarProteccionComponent', () => {
  let component: CotizarProteccionComponent;
  let fixture: ComponentFixture<CotizarProteccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CotizarProteccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CotizarProteccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
