import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseMethodComponent } from './purchase-method.component';

describe('PurchaseMethodComponent', () => {
  let component: PurchaseMethodComponent;
  let fixture: ComponentFixture<PurchaseMethodComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PurchaseMethodComponent]
    });
    fixture = TestBed.createComponent(PurchaseMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
