import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientLeadInfoModalComponent } from './client-lead-info-modal.component';

describe('ClientLeadInfoModalComponent', () => {
  let component: ClientLeadInfoModalComponent;
  let fixture: ComponentFixture<ClientLeadInfoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientLeadInfoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientLeadInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});