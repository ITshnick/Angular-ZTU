/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MessagerService } from './messager.service';

describe('Service: Messeger', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MessagerService]
    });
  });

  it('should ...', inject([MessagerService], (service: MessagerService) => {
    expect(service).toBeTruthy();
  }));
});
