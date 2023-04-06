import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappProfileModalComponent } from './whatsapp-profile-modal.component';

describe('WhatsappProfileModalComponent', () => {
  let component: WhatsappProfileModalComponent;
  let fixture: ComponentFixture<WhatsappProfileModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhatsappProfileModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhatsappProfileModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
