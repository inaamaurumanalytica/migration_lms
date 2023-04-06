import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ServerService } from '../services/server.service'
import { ClipBoardService } from '../services/clipboard.service'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/timer'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/take'
import { Pipe, PipeTransform } from '@angular/core';

@Component({
  selector: 'app-phone-verification',
  templateUrl: './phone-verification.component.html',
  styleUrls: ['./phone-verification.component.scss']
})
export class PhoneVerificationComponent implements OnInit {

  message = 'Register Successfully. Please verify email.';
  action = 'exit';
  showResendOTP: boolean = false
  btnStatus: boolean = false
  numberForm: FormGroup;
  otpForm: FormGroup
  showVerify: boolean = false
  showOTP: boolean = false
  selectedNumber: string = ""
  authToken: string = localStorage.getItem("token")
  userInfo: any = JSON.parse(localStorage.getItem("userInfo"))


  countDown;
  counter = 10;
  tick = 1000;

  showCounter: boolean = false

  constructor(private router: Router,
    private serverService: ServerService,
    private fb: FormBuilder,
    private clipBoardService: ClipBoardService) {
    if (this.authToken == null) {
      this.router.navigate(["/"])
      return
    } else {
      if (this.userInfo == null || this.userInfo.phone_verified) {
        this.router.navigate(["/"])
        return
      }
    }
  }

  ngOnInit() {
    this.buildForm();
    this.showVerify = true
  }

  go() {
    localStorage.clear()
    this.router.navigate(["/login"])
  }

  buildForm() {
    this.numberForm = this.fb.group({
      'phone': ['', [
        Validators.pattern(/^[6-9]\d{9}$/),
        Validators.required,
      ]
      ],
    });
    this.otpForm = this.fb.group({
      'otp': ['', [
        Validators.required,
      ]
      ],
    });
  }


  sendOtp() {
    this.btnStatus = true
    let body = {
      "phone": "91" + this.numberForm.value.phone
    }
    this.serverService.getOtp(body, this.authToken).subscribe(
      data => {
        this.showOTP = true
        this.selectedNumber = this.numberForm.value.phone
        this.showVerify = false
        this.btnStatus = false
        this.clipBoardService.showMessgeInText("OTP has been sent your mobile number", "success-snackbar")
      },
      err => {
        this.btnStatus = false
        this.clipBoardService.checkServerError(err, '')
      }
    )
  }

  submit() {
    this.btnStatus = true
    let body = {
      "phone": "91" + this.selectedNumber,
      "otp": this.otpForm.value.otp
    }
    this.serverService.verifiedPhoneNumber(body, this.authToken).subscribe(
      data => {
        this.btnStatus = false
        this.clipBoardService.showMessgeInText("Number Verified Successfully", "success-snackbar")
        if (this.userInfo.org_admin) {
          this.router.navigate(['/page/dashboard']);
        } else {
          this.router.navigate(['/page/project']);
        }
      },
      err => {
        this.btnStatus = false
        this.clipBoardService.checkServerError(err, '')
      }
    )
  }

  resendOtp() {
    let body = {
      "phone": "91" + this.numberForm.value.phone
    }
    this.serverService.getOtp(body, this.authToken).subscribe(
      data => {
        this.clipBoardService.showMessgeInText("OTP has been resend to your mobile number", "success-snackbar")
        this.counter = 60;
        this.tick = 1000;
        this.showCounter = true
        this.countDown = Observable.timer(0, this.tick)
          .take(this.counter)
          .map(() =>
            --this.counter)
        setTimeout(() => {
          this.showCounter = false
        }, 60000)
      },
      err => {
        this.clipBoardService.checkServerError(err, '')
      }
    )
  }

  gotToLogin() {
    localStorage.clear()
    this.router.navigate(["/"])
  }

  logout() {
    localStorage.clear()
    this.router.navigate(["/"])
  }

  getUserInfo() {
    this.serverService.userInfo(this.authToken).subscribe(
      data => {
        localStorage.setItem("userInfo", JSON.stringify(data))
        this.userInfo = data
        if (this.userInfo.organization_type == "Vendor") {
          if (this.userInfo.role != null) {
            this.router.navigate(['/page/dashboard']);
          } else {
            this.router.navigate(['/page/vendorProject']);
          }
        } else {
          if (this.userInfo.phone_verified) {
            if (this.userInfo.permissions.global[0].permission_list.includes(14) && this.userInfo.permissions.global[0].permission_list.includes(19)) {
              this.router.navigate(['/page/dashboard']);
            } else if (this.userInfo.permissions.global[0].permission_list.includes(14)) {
              this.router.navigate(['/page/user-dashboard']);
            } else {
              this.router.navigate(['/page/project']);
            }
          } else {
            this.router.navigate(['/phoneVerification']);
          }
        }
      },
      err => {
        this.btnStatus = false
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }

}



@Pipe({
  name: 'formatTime'
})
export class FormatTimePipe implements PipeTransform {

  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    return ('00' + minutes).slice(-2) + ':' + ('00' + Math.floor(value - minutes * 60)).slice(-2);
  }

}