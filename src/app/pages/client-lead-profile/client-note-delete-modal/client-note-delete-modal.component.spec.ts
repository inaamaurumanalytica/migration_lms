import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientNoteDeleteModalComponent } from './client-note-delete-modal.component';

describe('ClientNoteDeleteModalComponent', () => {
  let component: ClientNoteDeleteModalComponent;
  let fixture: ComponentFixture<ClientNoteDeleteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientNoteDeleteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientNoteDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});