import { TestBed } from '@angular/core/testing';

import { TimeCardService } from './time-card.service';

describe('TimeCardService', () => {
  let service: TimeCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
