import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappRuleEntryComponent } from './whatsapp-rule-entry.component';

describe('WhatsappRuleEntryComponent', () => {
  let component: WhatsappRuleEntryComponent;
  let fixture: ComponentFixture<WhatsappRuleEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhatsappRuleEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhatsappRuleEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
