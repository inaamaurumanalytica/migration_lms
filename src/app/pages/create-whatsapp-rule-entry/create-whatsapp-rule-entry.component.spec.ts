import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWhatsappRuleEntryComponent } from './create-whatsapp-rule-entry.component';

describe('CreateWhatsappRuleEntryComponent', () => {
  let component: CreateWhatsappRuleEntryComponent;
  let fixture: ComponentFixture<CreateWhatsappRuleEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateWhatsappRuleEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWhatsappRuleEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
