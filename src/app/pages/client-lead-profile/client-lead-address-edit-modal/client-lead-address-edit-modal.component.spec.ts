import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientLeadAddressEditModalComponent } from './client-lead-address-edit-modal.component';

describe('ClientLeadAddressEditModalComponent', () => {
  let component: ClientLeadAddressEditModalComponent;
  let fixture: ComponentFixture<ClientLeadAddressEditModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientLeadAddressEditModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientLeadAddressEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});