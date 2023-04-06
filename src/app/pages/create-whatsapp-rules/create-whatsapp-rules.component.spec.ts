import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWhatsappRulesComponent } from './create-whatsapp-rules.component';

describe('CreateWhatsappRulesComponent', () => {
  let component: CreateWhatsappRulesComponent;
  let fixture: ComponentFixture<CreateWhatsappRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateWhatsappRulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWhatsappRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
