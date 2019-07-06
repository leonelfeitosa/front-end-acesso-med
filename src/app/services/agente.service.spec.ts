import { TestBed } from '@angular/core/testing';

import { AgenteService } from './agente.service';

describe('AgenteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AgenteService = TestBed.get(AgenteService);
    expect(service).toBeTruthy();
  });
});
