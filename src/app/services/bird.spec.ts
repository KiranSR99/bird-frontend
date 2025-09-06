import { TestBed } from '@angular/core/testing';

import { Bird } from './bird';

describe('Bird', () => {
  let service: Bird;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Bird);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
