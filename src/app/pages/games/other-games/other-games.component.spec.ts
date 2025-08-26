import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherGamesComponent } from './other-games.component';

describe('OtherGamesComponent', () => {
  let component: OtherGamesComponent;
  let fixture: ComponentFixture<OtherGamesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OtherGamesComponent]
    });
    fixture = TestBed.createComponent(OtherGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
