import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientCreateRuleEntryModalComponent } from './client-create-rule-entry-modal.component';

describe('ClientCreateRuleEntryModalComponent', () => {
  let component: ClientCreateRuleEntryModalComponent;
  let fixture: ComponentFixture<ClientCreateRuleEntryModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClientCreateRuleEntryModalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientCreateRuleEntryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});