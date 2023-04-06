import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMediaPlanComponent } from './project-media-plan.component';

describe('ProjectMediaPlanComponent', () => {
  let component: ProjectMediaPlanComponent;
  let fixture: ComponentFixture<ProjectMediaPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectMediaPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectMediaPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
