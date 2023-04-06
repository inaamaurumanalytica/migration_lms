import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizePolicyModalInfoComponent } from './customize-policy-modal-info.component';

describe('CustomizePolicyModalInfoComponent', () => {
  let component: CustomizePolicyModalInfoComponent;
  let fixture: ComponentFixture<CustomizePolicyModalInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomizePolicyModalInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomizePolicyModalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
