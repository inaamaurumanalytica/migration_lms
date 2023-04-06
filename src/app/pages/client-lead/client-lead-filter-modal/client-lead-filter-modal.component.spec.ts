import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientLeadFilterModalComponent } from './client-lead-filter-modal.component';

describe('ClientLeadFilterModalComponent', () => {
  let component: ClientLeadFilterModalComponent;
  let fixture: ComponentFixture<ClientLeadFilterModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientLeadFilterModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientLeadFilterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});