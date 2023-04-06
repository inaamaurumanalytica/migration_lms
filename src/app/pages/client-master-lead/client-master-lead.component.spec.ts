import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientMasterLeadComponent } from './client-master-lead.component';

describe('ClientMasterLeadComponent', () => {
  let component: ClientMasterLeadComponent;
  let fixture: ComponentFixture<ClientMasterLeadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClientMasterLeadComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientMasterLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
