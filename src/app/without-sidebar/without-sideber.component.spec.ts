import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithoutSideberComponent } from './without-sideber.component';

describe('WithoutSideberComponent', () => {
  let component: WithoutSideberComponent;
  let fixture: ComponentFixture<WithoutSideberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WithoutSideberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithoutSideberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
