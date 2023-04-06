import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientListProjectModalComponent } from './client-list-project-modal.component';

describe('ClientListProjectModalComponent', () => {
  let component: ClientListProjectModalComponent;
  let fixture: ComponentFixture<ClientListProjectModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientListProjectModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientListProjectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
