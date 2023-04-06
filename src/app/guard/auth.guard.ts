import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ClipBoardService } from '../services/clipboard.service'
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    public router: Router,
    public clipBoardService:ClipBoardService
  ) { }

  canActivate() {
    if (localStorage.getItem("token") == null) {
      localStorage.clear();
      this.clipBoardService.showMessgeInText("Not Authorised", "error-snackbar")
      this.router.navigate(['/auth/login'])
    }
    return true;
  }
}
