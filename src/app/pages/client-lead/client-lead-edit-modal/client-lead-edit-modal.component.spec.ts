import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientLeadEditModalComponent } from './client-lead-edit-modal.component';

describe('ClientLeadEditModalComponent', () => {
  let component: ClientLeadEditModalComponent;
  let fixture: ComponentFixture<ClientLeadEditModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientLeadEditModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientLeadEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});