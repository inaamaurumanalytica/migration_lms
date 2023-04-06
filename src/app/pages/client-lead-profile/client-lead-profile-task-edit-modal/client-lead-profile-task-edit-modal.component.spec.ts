import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientLeadProfileEditModalComponent } from './client-lead-profile-task-edit-modal.component';

describe('ClientLeadProfileEditModalComponent', () => {
  let component: ClientLeadProfileEditModalComponent;
  let fixture: ComponentFixture<ClientLeadProfileEditModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientLeadProfileEditModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientLeadProfileEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});