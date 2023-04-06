import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientLeadDeleteModalComponent } from './client-lead-delete-modal.component';

describe('ClientLeadDeleteModalComponent', () => {
  let component: ClientLeadDeleteModalComponent;
  let fixture: ComponentFixture<ClientLeadDeleteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientLeadDeleteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientLeadDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});