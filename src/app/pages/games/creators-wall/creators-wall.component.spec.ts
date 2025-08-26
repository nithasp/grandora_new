import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatorsWallComponent } from './creators-wall.component';

describe('CreatorsWallComponent', () => {
  let component: CreatorsWallComponent;
  let fixture: ComponentFixture<CreatorsWallComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreatorsWallComponent]
    });
    fixture = TestBed.createComponent(CreatorsWallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
