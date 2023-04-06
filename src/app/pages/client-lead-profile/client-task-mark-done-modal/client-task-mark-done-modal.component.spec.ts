import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientTaskMarkDoneModalComponent } from './client-task-mark-done-modal.component';

describe('ClientTaskMarkDoneModalComponent', () => {
  let component: ClientTaskMarkDoneModalComponent;
  let fixture: ComponentFixture<ClientTaskMarkDoneModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientTaskMarkDoneModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientTaskMarkDoneModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});