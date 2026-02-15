import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateAccess } from './candidate-access';

describe('CandidateAccess', () => {
  let component: CandidateAccess;
  let fixture: ComponentFixture<CandidateAccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CandidateAccess]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateAccess);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
