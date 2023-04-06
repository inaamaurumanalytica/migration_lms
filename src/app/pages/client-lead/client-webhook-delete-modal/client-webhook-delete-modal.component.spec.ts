import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientWebhookDeleteModalComponent } from './client-webhook-delete-modal.component';

describe('ClientWebhookDeleteModalComponent', () => {
  let component: ClientWebhookDeleteModalComponent;
  let fixture: ComponentFixture<ClientWebhookDeleteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientWebhookDeleteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientWebhookDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});