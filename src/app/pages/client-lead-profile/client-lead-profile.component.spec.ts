import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientLeadProfileComponent } from './client-lead-profile.component';

describe('ClientLeadProfileComponent', () => {
  let component: ClientLeadProfileComponent;
  let fixture: ComponentFixture<ClientLeadProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientLeadProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientLeadProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
