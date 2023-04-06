import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAddressDeleteModalComponent } from './client-address-delete-modal.component';

describe('ClientAddressDeleteModalComponent', () => {
  let component: ClientAddressDeleteModalComponent;
  let fixture: ComponentFixture<ClientAddressDeleteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientAddressDeleteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientAddressDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});