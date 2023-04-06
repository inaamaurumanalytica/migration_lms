import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientRemarkModalComponent } from './client-remark-modal.component';

describe('ClientRemarkModalComponent', () => {
  let component: ClientRemarkModalComponent;
  let fixture: ComponentFixture<ClientRemarkModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientRemarkModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientRemarkModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});