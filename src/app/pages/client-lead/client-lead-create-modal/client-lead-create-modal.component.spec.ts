import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientLeadCreateModalComponent } from './client-lead-create-modal.component';

describe('ClientLeadCreateModalComponent', () => {
  let component: ClientLeadCreateModalComponent;
  let fixture: ComponentFixture<ClientLeadCreateModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientLeadCreateModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientLeadCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});