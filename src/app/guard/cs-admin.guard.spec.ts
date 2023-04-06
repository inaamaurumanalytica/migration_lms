import { TestBed, async, inject } from '@angular/core/testing';

import { CsAdminGuard } from './cs-admin.guard';

describe('CsAdminGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CsAdminGuard]
    });
  });

  it('should ...', inject([CsAdminGuard], (guard: CsAdminGuard) => {
    expect(guard).toBeTruthy();
  }));
});
