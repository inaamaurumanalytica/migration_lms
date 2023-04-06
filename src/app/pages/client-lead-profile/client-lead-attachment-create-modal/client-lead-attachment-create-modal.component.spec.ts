import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientLeadAttachmentCreateModalComponent } from './client-lead-attachment-create-modal.component';

describe('ClientLeadAttachmentCreateModalComponent', () => {
  let component: ClientLeadAttachmentCreateModalComponent;
  let fixture: ComponentFixture<ClientLeadAttachmentCreateModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientLeadAttachmentCreateModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientLeadAttachmentCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});