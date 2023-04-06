import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientProjectCreateModalComponent } from './client-project-create-modal.component';

describe('ClientProjectCreateModalComponent', () => {
  let component: ClientProjectCreateModalComponent;
  let fixture: ComponentFixture<ClientProjectCreateModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientProjectCreateModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientProjectCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});