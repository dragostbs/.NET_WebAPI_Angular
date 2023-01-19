import { TestBed } from '@angular/core/testing';

import { CalcMaService } from './calc-ma.service';

describe('CalcMaService', () => {
  let service: CalcMaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalcMaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
