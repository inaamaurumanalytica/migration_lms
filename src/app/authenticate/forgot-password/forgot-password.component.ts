import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../services/server.service'
import { ClipBoardService } from '../../services/clipboard.service'
import { Router } from '@angular/router'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  btnStatus : boolean = false
  action: string = ""
  userForm: FormGroup;
  authToken: any = localStorage.getItem("token");
  constructor(
    private router: Router,
    private serverService: ServerService,
    private fb: FormBuilder,
    private clipBoardService: ClipBoardService,
    private snackBar: MatSnackBar
  ) {
    if (this.authToken != null) {
      this.router.navigate(['/page'])
      return
    }
    this.userForm = this.fb.group({
      email: ['', Validators.required],
    })
  }

  ngOnInit() {
  }

  forgotpassword() {
    this.btnStatus = true
    let body = {
      "email": this.userForm.value.email
    }
    this.serverService.forgotpassword(body).subscribe(
      data => {
        this.clipBoardService.showMessgeInText("Reset Password link has been sent to your email.", "success-snackbar");
        this.router.navigate(['/login']);
      },
      err => {
        this.btnStatus = false
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }
}
