import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorCreateModalComponent } from './color-create-modal.component';

describe('ColorCreateModalComponent', () => {
  let component: ColorCreateModalComponent;
  let fixture: ComponentFixture<ColorCreateModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorCreateModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});