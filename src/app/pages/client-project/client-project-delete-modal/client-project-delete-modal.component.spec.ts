import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientProjectDeleteModalComponent } from './client-project-delete-modal.component';

describe('ClientProjectDeleteModalComponent', () => {
  let component: ClientProjectDeleteModalComponent;
  let fixture: ComponentFixture<ClientProjectDeleteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientProjectDeleteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientProjectDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});