import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentAccess } from './student-access';

describe('StudentAccess', () => {
  let component: StudentAccess;
  let fixture: ComponentFixture<StudentAccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentAccess]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentAccess);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
