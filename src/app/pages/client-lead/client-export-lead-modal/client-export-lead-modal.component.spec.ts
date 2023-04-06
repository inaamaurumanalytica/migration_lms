import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientExportLeadModalComponent } from './client-export-lead-modal.component';

describe('ClientExportLeadModalComponent', () => {
  let component: ClientExportLeadModalComponent;
  let fixture: ComponentFixture<ClientExportLeadModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientExportLeadModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientExportLeadModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});