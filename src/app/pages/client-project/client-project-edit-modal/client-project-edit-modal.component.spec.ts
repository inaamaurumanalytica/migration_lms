import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientProjectEditModalComponent } from './client-project-edit-modal.component';

describe('ClientProjectEditModalComponent', () => {
  let component: ClientProjectEditModalComponent;
  let fixture: ComponentFixture<ClientProjectEditModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientProjectEditModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientProjectEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});