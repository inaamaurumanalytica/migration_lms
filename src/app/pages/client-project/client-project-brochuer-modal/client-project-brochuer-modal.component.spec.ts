import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientProjectBrochuerModalComponent } from './client-project-brochuer-modal.component';

describe('ClientProjectBrochuerModalComponent', () => {
  let component: ClientProjectBrochuerModalComponent;
  let fixture: ComponentFixture<ClientProjectBrochuerModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientProjectBrochuerModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientProjectBrochuerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});