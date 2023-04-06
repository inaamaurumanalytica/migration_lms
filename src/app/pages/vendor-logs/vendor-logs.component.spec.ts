import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorLogsComponent } from './vendor-logs.component';

describe('VendorLogsComponent', () => {
  let component: VendorLogsComponent;
  let fixture: ComponentFixture<VendorLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
