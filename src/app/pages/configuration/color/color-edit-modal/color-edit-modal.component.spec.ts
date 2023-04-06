import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorEditModalComponent } from './color-edit-modal.component';

describe('ColorEditModalComponent', () => {
  let component: ColorEditModalComponent;
  let fixture: ComponentFixture<ColorEditModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorEditModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});