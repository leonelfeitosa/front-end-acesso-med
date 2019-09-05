import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarClinicaComponent } from './cadastrar-clinica.component';

describe('CadastrarClinicaComponent', () => {
  let component: CadastrarClinicaComponent;
  let fixture: ComponentFixture<CadastrarClinicaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CadastrarClinicaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastrarClinicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
