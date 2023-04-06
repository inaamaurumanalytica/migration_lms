import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionAddModalComponent } from './permission-add-modal.component';

describe('PermissionAddModalComponent', () => {
  let component: PermissionAddModalComponent;
  let fixture: ComponentFixture<PermissionAddModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermissionAddModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});