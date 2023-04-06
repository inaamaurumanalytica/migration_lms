import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientDocumentDeleteModalComponent } from './client-document-delete-modal.component';

describe('ClientDocumentDeleteModalComponent', () => {
  let component: ClientDocumentDeleteModalComponent;
  let fixture: ComponentFixture<ClientDocumentDeleteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientDocumentDeleteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientDocumentDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});