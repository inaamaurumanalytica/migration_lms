import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientRuleAssignmentComponent } from './client-rule-assignment.component';

describe('ClientRuleAssignmentComponent', () => {
  let component: ClientRuleAssignmentComponent;
  let fixture: ComponentFixture<ClientRuleAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientRuleAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientRuleAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
