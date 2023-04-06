import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesAccountCreateModalComponent } from './sales-account-create-modal.component';

describe('SalesAccountCreateModalComponent', () => {
  let component: SalesAccountCreateModalComponent;
  let fixture: ComponentFixture<SalesAccountCreateModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesAccountCreateModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesAccountCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
