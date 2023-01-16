import { TestBed } from '@angular/core/testing';

import { CandlesApiService } from './candles-api.service';

describe('CandlesApiService', () => {
  let service: CandlesApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CandlesApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
