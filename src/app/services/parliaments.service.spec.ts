import { TestBed } from '@angular/core/testing';

import { ParliamentsService } from './parliaments.service';

describe('ParliamentsService', () => {
  let service: ParliamentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParliamentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
