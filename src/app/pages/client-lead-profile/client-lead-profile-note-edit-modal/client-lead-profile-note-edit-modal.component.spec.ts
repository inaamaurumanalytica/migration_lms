import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientLeadProfileNoteEditModalComponent } from './client-lead-profile-note-edit-modal.component';

describe('ClientLeadProfileNoteEditModalComponent', () => {
  let component: ClientLeadProfileNoteEditModalComponent;
  let fixture: ComponentFixture<ClientLeadProfileNoteEditModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientLeadProfileNoteEditModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientLeadProfileNoteEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});