import { TestBed } from '@angular/core/testing';

import { LocalResolverService } from './local.resolver.service'

describe('LocalResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LocalResolverService = TestBed.get(LocalResolverService);
    expect(service).toBeTruthy();
  });
});
