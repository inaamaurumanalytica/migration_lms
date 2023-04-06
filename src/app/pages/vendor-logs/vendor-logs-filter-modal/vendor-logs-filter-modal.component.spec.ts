import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorLogsFilterModalComponent } from './vendor-logs-filter-modal.component';

describe('VendorLogsFilterModalComponent', () => {
  let component: VendorLogsFilterModalComponent;
  let fixture: ComponentFixture<VendorLogsFilterModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorLogsFilterModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorLogsFilterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});