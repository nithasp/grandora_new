import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficialStoreComponent } from './official-store.component';

describe('OfficialStoreComponent', () => {
  let component: OfficialStoreComponent;
  let fixture: ComponentFixture<OfficialStoreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OfficialStoreComponent]
    });
    fixture = TestBed.createComponent(OfficialStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
