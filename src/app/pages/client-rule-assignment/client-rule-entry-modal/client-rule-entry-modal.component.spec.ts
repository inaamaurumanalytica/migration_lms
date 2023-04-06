import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientRuleEntryModalComponent } from './client-rule-entry-modal.component';

describe('ClientRuleEntryModalComponent', () => {
  let component: ClientRuleEntryModalComponent;
  let fixture: ComponentFixture<ClientRuleEntryModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClientRuleEntryModalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientRuleEntryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});