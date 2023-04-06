import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientLeadProfileCreateModalComponent } from './client-lead-profile-task-create-modal.component';

describe('ClientLeadProfileCreateModalComponent', () => {
  let component: ClientLeadProfileCreateModalComponent;
  let fixture: ComponentFixture<ClientLeadProfileCreateModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientLeadProfileCreateModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientLeadProfileCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});