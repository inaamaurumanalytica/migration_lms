import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientEditProfileModalComponent } from './client-edit-profile-modal.component';

describe('ClientEditProfileModalComponent', () => {
  let component: ClientEditProfileModalComponent;
  let fixture: ComponentFixture<ClientEditProfileModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientEditProfileModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientEditProfileModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
