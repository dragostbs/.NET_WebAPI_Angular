import { TestBed } from '@angular/core/testing';

import { CandlesChartService } from './candles-chart.service';

describe('CandlesChartService', () => {
  let service: CandlesChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CandlesChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
