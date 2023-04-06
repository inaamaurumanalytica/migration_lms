import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteProjectStatusModalComponent } from './delete-project-status-modal.component';

describe('DeleteProjectStatusModalComponent', () => {
  let component: DeleteProjectStatusModalComponent;
  let fixture: ComponentFixture<DeleteProjectStatusModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteProjectStatusModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteProjectStatusModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
