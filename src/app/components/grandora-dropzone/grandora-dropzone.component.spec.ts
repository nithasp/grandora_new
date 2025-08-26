import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrandoraDropzoneComponent } from './grandora-dropzone.component';

describe('GrandoraDropzoneComponent', () => {
  let component: GrandoraDropzoneComponent;
  let fixture: ComponentFixture<GrandoraDropzoneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GrandoraDropzoneComponent]
    });
    fixture = TestBed.createComponent(GrandoraDropzoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
