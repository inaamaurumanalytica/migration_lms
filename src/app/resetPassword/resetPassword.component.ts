import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import {ClipBoardService} from '../services/clipboard.service';

import { ServerService } from '../services/server.service'

@Component({
  selector: 'app-resetPassword',
  templateUrl: './resetPassword.component.html',
  styleUrls: ['./resetPassword.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  message: string = "";
  action = 'exit';
  parameter: any = {};
  userForm: FormGroup;
  constructor(private router: Router,
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    private serverService: ServerService,
    private route: ActivatedRoute,
    private clipBoardService: ClipBoardService) {
  }

  ngOnInit() {
    this.userForm = this.fb.group({
      'newPassword': ['', [
        Validators.minLength(6),
        Validators.maxLength(25),
      ]
      ],
      'confirmPassword': ['', [
        Validators.minLength(6),
        Validators.maxLength(25),
      ]
      ],
    }, { validator: this.checkPasswords });
    this.route.params.subscribe(params => this.parameter = params);
    this.checkForgotPassword();
  }

  
  checkForgotPassword() {
    this.serverService.checkForgotPasswordToken(this.parameter).subscribe(
      data => {

      },
      err => {
        this.clipBoardService.checkServerError(err, "");
        this.router.navigate(['/']);
      }
    )
  }

  resetPassword() {
    let body = {
      "password": this.userForm.value.newPassword,
      "password_confirmation": this.userForm.value.confirmPassword,
    }
    this.serverService.resetPassword(this.parameter, body).subscribe(
      data => {
        this.clipBoardService.showMessgeInText("Password Reset Successfully", "success-snackbar");
        this.router.navigate(['/']);
      },
      err => {
        this.clipBoardService.checkServerError(err, "");
      }
    )
  }


  checkPasswords(group: FormGroup) {
    let pass = group.controls.newPassword.value;
    let confirmPass = group.controls.confirmPassword.value;

    return pass === confirmPass ? null : { notSame: true }
  }



}

