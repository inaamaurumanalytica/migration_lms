import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CplCalculatorComponent } from './cpl-calculator.component';

describe('CplCalculatorComponent', () => {
  let component: CplCalculatorComponent;
  let fixture: ComponentFixture<CplCalculatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CplCalculatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CplCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
