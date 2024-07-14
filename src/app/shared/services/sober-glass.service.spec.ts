import { TestBed } from '@angular/core/testing';

import { SoberGlassService } from './sober-glass.service';

describe('SoberGlassService', () => {
  let service: SoberGlassService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SoberGlassService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
