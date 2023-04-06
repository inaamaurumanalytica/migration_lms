import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientRuleEntryDeleteModalComponent } from './client-rule-entry-delete-modal.component';

describe('ClientRuleEntryDeleteModalComponent', () => {
  let component: ClientRuleEntryDeleteModalComponent;
  let fixture: ComponentFixture<ClientRuleEntryDeleteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientRuleEntryDeleteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientRuleEntryDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});