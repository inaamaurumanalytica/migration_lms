import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientProjectStatsModalComponent } from './client-project-stats-modal.component';

describe('ClientProjectStatsModalComponent', () => {
  let component: ClientProjectStatsModalComponent;
  let fixture: ComponentFixture<ClientProjectStatsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientProjectStatsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientProjectStatsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});