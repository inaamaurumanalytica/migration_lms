import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectInsightComponent } from './project-insight.component';

describe('ProjectInsightComponent', () => {
  let component: ProjectInsightComponent;
  let fixture: ComponentFixture<ProjectInsightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectInsightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectInsightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
