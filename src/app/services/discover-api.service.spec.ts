import { TestBed } from '@angular/core/testing';

import { DiscoverApiService } from './discover-api.service';

describe('DiscoverApiService', () => {
  let service: DiscoverApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiscoverApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
