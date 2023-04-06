import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWhatsappRuleEntryComponent } from './edit-whatsapp-rule-entry.component';

describe('EditWhatsappRuleEntryComponent', () => {
  let component: EditWhatsappRuleEntryComponent;
  let fixture: ComponentFixture<EditWhatsappRuleEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditWhatsappRuleEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditWhatsappRuleEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
