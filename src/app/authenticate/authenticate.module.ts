import { NgModule } from '@angular/core';
import { MatCardModule, MatIconModule, MatButtonModule, MatSnackBarModule, MatTooltipModule, MatCheckboxModule, MatRadioModule } from '@angular/material'
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SignupComponent } from './signup/signup.component'

import { AuthenticateComponent } from './authenticate.component'
import { AppRoutingModule } from './authenticate.routing'
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [AuthenticateComponent, LoginComponent, ForgotPasswordComponent,SignupComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule, FormsModule,
    AppRoutingModule,
    MatCardModule,
    MatCheckboxModule,
    MatSnackBarModule,
    FlexLayoutModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatRadioModule
  ]
})
export class AuthenticateModule { }
