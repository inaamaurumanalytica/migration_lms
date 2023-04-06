import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientLeadProfileNoteCreateModalComponent } from './client-lead-profile-note-create-modal.component';

describe('ClientLeadProfileNoteCreateModalComponent', () => {
  let component: ClientLeadProfileNoteCreateModalComponent;
  let fixture: ComponentFixture<ClientLeadProfileNoteCreateModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientLeadProfileNoteCreateModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientLeadProfileNoteCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});