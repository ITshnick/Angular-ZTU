import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyupserviceComponent } from './buyupservice.component';

describe('BuyupserviceComponent', () => {
  let component: BuyupserviceComponent;
  let fixture: ComponentFixture<BuyupserviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyupserviceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyupserviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
