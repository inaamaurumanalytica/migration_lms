import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientLeadFailedModalComponent } from './client-lead-failed-modal.component';

describe('ClientLeadFailedModalComponent', () => {
  let component: ClientLeadFailedModalComponent;
  let fixture: ComponentFixture<ClientLeadFailedModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientLeadFailedModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientLeadFailedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});