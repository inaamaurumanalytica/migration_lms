import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesAccountComponent } from './sales-account.component';

describe('SalesAccountComponent', () => {
  let component: SalesAccountComponent;
  let fixture: ComponentFixture<SalesAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
