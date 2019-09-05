/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AgentesComponent } from './agentes.component';

describe('AgentesComponent', () => {
  let component: AgentesComponent;
  let fixture: ComponentFixture<AgentesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
