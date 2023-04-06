import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientLeadWebhookCreateModalComponent } from './client-lead-webhook-create-modal.component';

describe('ClientLeadWebhookCreateModalComponent', () => {
  let component: ClientLeadWebhookCreateModalComponent;
  let fixture: ComponentFixture<ClientLeadWebhookCreateModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientLeadWebhookCreateModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientLeadWebhookCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});