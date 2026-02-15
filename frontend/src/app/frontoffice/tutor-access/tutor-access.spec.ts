import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorAccess } from './tutor-access';

describe('TutorAccess', () => {
  let component: TutorAccess;
  let fixture: ComponentFixture<TutorAccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TutorAccess]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TutorAccess);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
