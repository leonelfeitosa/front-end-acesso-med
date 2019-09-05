import { TestBed } from '@angular/core/testing';

import { FiltroService } from './filtro.service';

describe('FiltroService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FiltroService = TestBed.get(FiltroService);
    expect(service).toBeTruthy();
  });
});
