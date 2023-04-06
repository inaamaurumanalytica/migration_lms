import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../services/server.service'
import { ClipBoardService } from '../../services/clipboard.service'
import { Router } from '@angular/router'
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { tap } from 'rxjs/operators';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  btnStatus: boolean = false
  action: string = ""
  signupForm: FormGroup;
  checkedTermsAndPrivacy: boolean = true
  selectedUserCategory = {}
  get selectedUserCategoryControl() {
    return this.signupForm.controls.selectedUserCategory as FormControl
  }
  userCategory = [
    {
      "id": 1,
      "label": "I am a Builder",
      "value": "Builder",
      "image": "/assets/images/builder.png"
    },
    {
      "id": 2,
      "label": "I am an Agent",
      "value": "Agent",
      "image": "/assets/images/agent.png"
    },
  ];
  constructor(
    private router: Router,
    private serverService: ServerService,
    private fb: FormBuilder,
    private clipBoardService: ClipBoardService,
    private snackBar: MatSnackBar
  ) {
    if (localStorage.getItem("token") != null) {
      this.router.navigate(['/page/dashboard']);
    }

    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      selectedUserCategory: [this.userCategory[0], Validators.required],
      location: [''],
      organizationName: ['', Validators.required],
      email: ['', [Validators.required,
      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
      Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, { validator: this.checkIfMatchingPasswords('password', 'confirmPassword') });

    this.selectedUserCategoryControl.valueChanges.pipe(tap((data) => {
      if (data.value === 'agent') {
        this.signupForm.controls.organizationName.clearValidators()
        this.signupForm.controls.organizationName.setErrors(null)
        this.signupForm.controls.organizationName.reset()
        this.signupForm.controls.location.setValidators([Validators.required])
      } else {
        this.signupForm.controls.organizationName.setValidators([Validators.required])
        this.signupForm.controls.location.clearValidators()
        this.signupForm.controls.location.setErrors(null)
        this.signupForm.controls.location.reset()

      }

    })).subscribe()
  }

  ngOnInit() {

  }

  checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
      const passwordInput = group.controls[passwordKey],
        passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({ notEquivalent: true })
      }
      else {
        return passwordConfirmationInput.setErrors(null);
      }
    }
  }

  signup() {
    this.btnStatus = true
    let body = {
      "name": this.signupForm.value.name,
      "email": this.signupForm.value.email,
      "password": this.signupForm.value.password,
      "password_confirmation": this.signupForm.value.confirmPassword
    }

    if (this.selectedUserCategoryControl.value.id == 1) {
      body['organization_name'] = this.signupForm.value.organizationName;
    } else {
      body['location'] = this.signupForm.value.location;
    }

    this.serverService.signup(this.selectedUserCategoryControl.value.id == 1 ? 'builder_signup' : 'agent_signup ', body).subscribe(
      data => {
        this.clipBoardService.showMessgeInText(data.message, 'success-snackbar')
        this.router.navigate(["/auth/login"])
        this.btnStatus = false;
      },
      err => {
        this.btnStatus = false
        this.clipBoardService.checkServerError(err, '')
      }
    )
  }

  checkTerms(event) {
    this.checkedTermsAndPrivacy = event.checked
  }


  backToHome() {
    this.router.navigate(['/'])
  }
}
