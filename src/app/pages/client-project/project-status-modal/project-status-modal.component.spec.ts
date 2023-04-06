import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectStatusModalComponent } from './project-status-modal.component';

describe('ProjectStatusModalComponent', () => {
  let component: ProjectStatusModalComponent;
  let fixture: ComponentFixture<ProjectStatusModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectStatusModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectStatusModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
