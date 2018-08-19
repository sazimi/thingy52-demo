import { TestBed, inject } from '@angular/core/testing';

import { ThingyService } from './thingy.service';

describe('ThingyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ThingyService]
    });
  });

  it('should be created', inject([ThingyService], (service: ThingyService) => {
    expect(service).toBeTruthy();
  }));
});
