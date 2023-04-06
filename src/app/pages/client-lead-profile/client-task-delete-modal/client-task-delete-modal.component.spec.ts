import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientTaskDeleteModalComponent } from './client-task-delete-modal.component';

describe('ClientTaskDeleteModalComponent', () => {
  let component: ClientTaskDeleteModalComponent;
  let fixture: ComponentFixture<ClientTaskDeleteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientTaskDeleteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientTaskDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});