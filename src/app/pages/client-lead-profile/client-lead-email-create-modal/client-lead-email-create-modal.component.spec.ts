import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientLeadEmailCreateModalComponent } from './client-lead-email-create-modal.component';

describe('ClientLeadEmailCreateModalComponent', () => {
  let component: ClientLeadEmailCreateModalComponent;
  let fixture: ComponentFixture<ClientLeadEmailCreateModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientLeadEmailCreateModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientLeadEmailCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});