import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriasAsociadoComponent } from './categorias-asociado.component';

describe('CategoriasAsociadoComponent', () => {
  let component: CategoriasAsociadoComponent;
  let fixture: ComponentFixture<CategoriasAsociadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoriasAsociadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriasAsociadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
