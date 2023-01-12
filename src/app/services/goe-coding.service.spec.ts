import { TestBed } from '@angular/core/testing';

import { GoeCodingService } from './goe-coding.service';

describe('GoeCodingService', () => {
  let service: GoeCodingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoeCodingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
