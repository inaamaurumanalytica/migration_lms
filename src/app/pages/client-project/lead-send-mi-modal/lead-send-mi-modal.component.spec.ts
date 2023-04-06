import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadSendMiModalComponent } from './lead-send-mi-modal.component';

describe('LeadSendMiModalComponent', () => {
  let component: LeadSendMiModalComponent;
  let fixture: ComponentFixture<LeadSendMiModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadSendMiModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadSendMiModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
