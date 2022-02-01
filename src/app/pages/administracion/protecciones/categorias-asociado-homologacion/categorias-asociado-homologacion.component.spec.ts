import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriasAsociadoHomologacionComponent } from './categorias-asociado-homologacion.component';

describe('CategoriasAsociadoHomologacionComponent', () => {
  let component: CategoriasAsociadoHomologacionComponent;
  let fixture: ComponentFixture<CategoriasAsociadoHomologacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoriasAsociadoHomologacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriasAsociadoHomologacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
