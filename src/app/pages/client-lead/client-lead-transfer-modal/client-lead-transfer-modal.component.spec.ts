import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientLeadTransferModalComponent } from './client-lead-transfer-modal.component';

describe('ClientLeadTransferModalComponent', () => {
  let component: ClientLeadTransferModalComponent;
  let fixture: ComponentFixture<ClientLeadTransferModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClientLeadTransferModalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientLeadTransferModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});