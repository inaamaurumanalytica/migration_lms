import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientProjectInfoModalComponent } from './client-project-info-modal.component';

describe('ClientProjectInfoModalComponent', () => {
  let component: ClientProjectInfoModalComponent;
  let fixture: ComponentFixture<ClientProjectInfoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientProjectInfoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientProjectInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});