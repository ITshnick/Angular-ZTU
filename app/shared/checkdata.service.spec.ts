/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CheckdataService } from './checkdata.service';

describe('Service: Checkdata', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CheckdataService]
    });
  });

  it('should ...', inject([CheckdataService], (service: CheckdataService) => {
    expect(service).toBeTruthy();
  }));
});
