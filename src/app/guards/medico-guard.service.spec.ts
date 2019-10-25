import { TestBed } from '@angular/core/testing';

import { MedicoGuardService } from './medico-guard.service';

describe('MedicoGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MedicoGuardService = TestBed.get(MedicoGuardService);
    expect(service).toBeTruthy();
  });
});
