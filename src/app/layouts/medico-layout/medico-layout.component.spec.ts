import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicoLayoutComponent } from './medico-layout.component';

describe('MedicoLayoutComponent', () => {
  let component: MedicoLayoutComponent;
  let fixture: ComponentFixture<MedicoLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicoLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicoLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
