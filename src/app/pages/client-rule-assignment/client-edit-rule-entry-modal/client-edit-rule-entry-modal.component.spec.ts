import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientEditRuleEntryModalComponent } from './client-edit-rule-entry-modal.component';

describe('ClientEditRuleEntryModalComponent', () => {
  let component: ClientEditRuleEntryModalComponent;
  let fixture: ComponentFixture<ClientEditRuleEntryModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClientEditRuleEntryModalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientEditRuleEntryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});