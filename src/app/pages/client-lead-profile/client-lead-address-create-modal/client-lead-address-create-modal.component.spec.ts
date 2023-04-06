import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientLeadAddressCreateModalComponent } from './client-lead-address-create-modal.component';

describe('ClientLeadAddressCreateModalComponent', () => {
  let component: ClientLeadAddressCreateModalComponent;
  let fixture: ComponentFixture<ClientLeadAddressCreateModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientLeadAddressCreateModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientLeadAddressCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});