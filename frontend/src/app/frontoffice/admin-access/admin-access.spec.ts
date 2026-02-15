import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAccess } from './admin-access';

describe('AdminAccess', () => {
  let component: AdminAccess;
  let fixture: ComponentFixture<AdminAccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminAccess]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAccess);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
