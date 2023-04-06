import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../services/server.service'
import { ClipBoardService } from '../../services/clipboard.service'
import { Router } from '@angular/router'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AutofillMonitor } from '@angular/cdk/text-field';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  btnStatus: boolean = false
  showLoginKey: boolean = false
  action: string = ""
  userForm: FormGroup;
  userKeyForm: FormGroup
  authToken: any = localStorage.getItem("token");
  userInfo: any = JSON.parse(localStorage.getItem("userInfo"));
  
  constructor(private router: Router,
    private fb: FormBuilder,
    private clipBoardService: ClipBoardService,
    private autofill: AutofillMonitor,
    private serverService: ServerService) {
    if (this.authToken != null && this.userInfo != null) {
      this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
      // console.log(this.userInfo.admin);
      if (this.userInfo.admin)
      {
        this.router.navigate(['/page/dashboard-vendor']);
      } 
      else if (this.userInfo.org_admin) 
      {
        if (this.userInfo.member_type == "Vendor")
        {
          this.router.navigate(['/page/dashboard-vendor']);
        } 
        else 
        {
          if (this.userInfo.phone_verified)
          {
            this.router.navigate(['/page/dashboard']);
          } else 
          {
            this.router.navigate(['/phoneVerification']);
          }
        }
      } else {
        if (this.userInfo.member_type == "Vendor") {
          this.router.navigate(['/page/project']);
        } else {
          if (this.userInfo.phone_verified) {
            this.router.navigate(['/page/project']);
          } else {
            this.router.navigate(['/phoneVerification']);
          }
        }
      }
    }

    this.buildForm()
  }

  ngOnInit() {
  }

  login() {
    this.btnStatus = true;
    let body = {
      "email": this.userForm.value.email,
      "password": this.userForm.value.password
    }
    this.serverService.login(body).subscribe(
      data1 => {
        localStorage.setItem("token", data1.auth_token);
        this.serverService.userInfo(data1.auth_token).subscribe(
          data => {
            localStorage.setItem("userInfo", JSON.stringify(data));
            this.clipBoardService.showMessgeInText("User Logged In", "success-snackbar")
            if(data.admin){
              this.router.navigate(['/page/dashboard-vendor']);
            }
            else if (data.org_admin && data.member_type == "Client") {
              this.router.navigate(['/page/dashboard']);
            } 
            //changes made
            else if (!data.org_admin) {
              if (data.member_type == "Vendor") 
              {
                //changes made
                this.router.navigate(['/page/project']);
              } 
              //changes made
              else if(data.role == "SalesAdmin"){
                this.router.navigate(['/page/dashboard-vendor']);
              }
              //
              else {
                if (data.phone_verified) {
                  this.router.navigate(['/page/dashboard']);
                } else {
                  this.router.navigate(['/phoneVerification']);
                }
              }
            } else {
              if (data.member_type == "Vendor") {
                this.router.navigate(['/page/dashboard-vendor']);
              } else {
                if (data.phone_verified) {
                  this.router.navigate(['/page/project']);
                } else {
                  this.router.navigate(['/phoneVerification']);
                }
              }
            }
            this.btnStatus = false;
          },
          err => {
            this.clipBoardService.showMessgeInText("Something went wrong", 'error-snackbar')
            this.btnStatus = false;
          }
        )
      },
      err => {

        if (err.status == 401) {
          let msg = JSON.parse(err._body);
          this.clipBoardService.showMessgeInText(msg.error.user_authentication, 'error-snackbar')
        } else {
          this.clipBoardService.showMessgeInText("Something went wrong. Please Try Again", 'error-snackbar')
        }
        this.btnStatus = false;
      }
    )
  }

  loginKey() {
    this.btnStatus = true;
    this.serverService.userInfo(this.userKeyForm.value.token).subscribe(
      data => {
        localStorage.setItem("token", this.userKeyForm.value.token);
        localStorage.setItem("userInfo", JSON.stringify(data));
        this.clipBoardService.showMessgeInText("User Logged In", "success-snackbar");
        // console.log(data.org_admin);
        // console.log(data.member_type);
        // console.log("hi")
        if (data.admin) 
        {
          this.router.navigate(['/page/project']);
        } 
        else if (data.org_admin) 
          {
            if (data.member_type == "Vendor") 
            {
              this.router.navigate(['/page/project']);
            } 
            else 
            {
              if (data.phone_verified) 
              {
                this.router.navigate(['/page/dashboard']);
              } 
              else 
              {
                this.router.navigate(['/phoneVerification']);
              }
            }
          } 
          else if(data.org_admin == false)
          {
            // console.log("hello");
            if(data.member_type == "Vendor") 
            {
              // console.log("hi");
              this.router.navigate(['/page/project']);
            } 
            else 
            {
              if (data.phone_verified) 
              {
              this.router.navigate(['/page/project']);
              } 
              else 
              {
                this.router.navigate(['/phoneVerification']);
              }
            }
          }
          // else{
          //   if(data.role == "SalesAdmin"){
          //     this.router.navigate(['/page/dashboard-vendor'])
          //   }
          //   else{
          //     if (data.phone_verified) 
          //     {
          //     this.router.navigate(['/page/dashboard-vendor']);
          //     } 
          //     else 
          //     {
          //       this.router.navigate(['/phoneVerification']);
          //     }
          //   }
          // }
        this.btnStatus = false;
      },
      err => {
        this.clipBoardService.showMessgeInText("Something went wrong", "error-snackbar")
        this.btnStatus = false;
      }
    )
  }

  toggleLogin() {
    this.showLoginKey = !this.showLoginKey
    this.buildForm()
    this.btnStatus = false
  }

  buildForm() {
    this.userForm = this.fb.group({
      email: ['', [Validators.required,
      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
      Validators.email]],
      password: ['', Validators.required],
    })
    this.userKeyForm = this.fb.group({
      token: ['', Validators.required]
    });
  }

  goToPolicy() {
    this.router.navigate(['/privacy-policy']);
  }

  goToTerms() {
    this.router.navigate(['/terms-and-conditions']);
  }

  signUp() {
    this.router.navigate(['/auth/sign-up']);
  }
}
