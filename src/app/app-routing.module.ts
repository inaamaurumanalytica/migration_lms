import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ErrorComponent } from './error/error.component'
import { PrivacyComponent } from './privacy/privacy.component';
import { TermsComponent } from './terms/terms.component';
import { PhoneVerificationComponent } from './phone-verification/phone-verification.component';
import { HomeComponent } from './home/home.component';
import { CplCalculatorComponent } from './cpl-calculator/cpl-calculator.component';
import { AuthGuard } from './guard/auth.guard';


const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: '', loadChildren: './authenticate/authenticate.module#AuthenticateModule' },
  { path: 'privacy-policy', component: PrivacyComponent, },
  { path: 'cpl-calculator', component: CplCalculatorComponent,canActivate: [AuthGuard] },
  { path: 'phoneVerification', component: PhoneVerificationComponent, },
  { path: 'terms-condition', component: TermsComponent, },
  { path: '404', component: ErrorComponent, },
  { path: 'auth', loadChildren: './authenticate/authenticate.module#AuthenticateModule' },
  { path: 'page', loadChildren: './pages/pages.module#PagesModule' },
  { path: 'ws-page', loadChildren: './without-sidebar/without-sidebar.module#WithoutSidebarModule' },
  { path: 'verifyEmail/:email/:code', loadChildren: './verifyEmail/verifyEmail.module#VerifyEmailModule' },
  { path: 'resetPassword/:email/:code', loadChildren: './resetPassword/resetPassword.module#ResetPasswordModule' },

  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
