import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { AuthGuard } from '../guard/auth.guard';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component'

import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthenticateComponent } from './authenticate.component';
const authRoutes: Routes = [
  {
    path: '',
    component: AuthenticateComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent, pathMatch: 'full' },
      { path: 'sign-up', component: SignupComponent, pathMatch: 'full' },
      { path: 'forgetpassword', component: ForgotPasswordComponent, pathMatch: 'full' },
      { path: '**', redirectTo: '404' },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(authRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }