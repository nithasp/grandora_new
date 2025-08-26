import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrandoraSelectComponent } from './grandora-select.component';

describe('GrandoraSelectComponent', () => {
  let component: GrandoraSelectComponent;
  let fixture: ComponentFixture<GrandoraSelectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GrandoraSelectComponent]
    });
    fixture = TestBed.createComponent(GrandoraSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
