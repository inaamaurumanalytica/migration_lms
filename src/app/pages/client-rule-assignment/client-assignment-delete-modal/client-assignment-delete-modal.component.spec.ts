import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAssignmentDeleteModalComponent } from './client-assignment-delete-modal.component';

describe('ClientAssignmentDeleteModalComponent', () => {
  let component: ClientAssignmentDeleteModalComponent;
  let fixture: ComponentFixture<ClientAssignmentDeleteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientAssignmentDeleteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientAssignmentDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});