import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientUploadModalComponent } from './client-upload-modal.component';

describe('ClientUploadModalComponent', () => {
  let component: ClientUploadModalComponent;
  let fixture: ComponentFixture<ClientUploadModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientUploadModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientUploadModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});