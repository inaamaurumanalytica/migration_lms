import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientRuleAssignmentCreateModalComponent } from './client-rule-assignment-create-modal.component';

describe('ClientRuleAssignmentCreateModalComponent', () => {
  let component: ClientRuleAssignmentCreateModalComponent;
  let fixture: ComponentFixture<ClientRuleAssignmentCreateModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientRuleAssignmentCreateModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientRuleAssignmentCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});