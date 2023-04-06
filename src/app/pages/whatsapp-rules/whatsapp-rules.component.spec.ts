import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappRulesComponent } from './whatsapp-rules.component';

describe('WhatsappRulesComponent', () => {
  let component: WhatsappRulesComponent;
  let fixture: ComponentFixture<WhatsappRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhatsappRulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhatsappRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
