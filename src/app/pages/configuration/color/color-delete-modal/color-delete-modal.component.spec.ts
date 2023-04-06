import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorDeleteModalComponent } from './color-delete-modal.component';

describe('ColorDeleteModalComponent', () => {
  let component: ColorDeleteModalComponent;
  let fixture: ComponentFixture<ColorDeleteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorDeleteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});