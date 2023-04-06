import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadRequestComponent } from './lead-request.component';

describe('LeadRequestComponent', () => {
  let component: LeadRequestComponent;
  let fixture: ComponentFixture<LeadRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
