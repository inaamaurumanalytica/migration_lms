import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAssignLeadModalComponent } from './client-assign-lead-modal.component';

describe('ClientAssignLeadModalComponent', () => {
  let component: ClientAssignLeadModalComponent;
  let fixture: ComponentFixture<ClientAssignLeadModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientAssignLeadModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientAssignLeadModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});