import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { MatInputModule, MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatMenuModule, MatTable, MatTableModule, MatCard, MatCardModule, MatAutocompleteModule, } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { ErrorComponent } from './error/error.component';
import { PagesModule } from "./pages/pages.module";
import { VerifyEmailModule } from "./verifyEmail/verifyEmail.module";
import { AuthenticateModule } from "./authenticate/authenticate.module";
import { ServerService } from './services/server.service'
import { ClipBoardService } from './services/clipboard.service'
import { UtilsService } from './services/utils.service'
import { HttpModule } from '@angular/http'
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TermsComponent } from './terms/terms.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { PhoneVerificationModule } from './phone-verification/phone-verification.module';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { PromptUpdateService } from './services/prompt-update.service';
import { CheckForUpdateService } from './services/check-for-update.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HomeComponent } from './home/home.component';
import { WithoutSidebarModule } from './without-sidebar/without-sidebar.module';
import { ResourceModalComponent } from './main-nav/resource-modal/resource-modal.component';
import { CplCalculatorComponent } from './cpl-calculator/cpl-calculator.component';
// import { DecimalPipe } from '@angular/common';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    ErrorComponent,
    PrivacyComponent,
    TermsComponent,
    FooterComponent,
    ResourceModalComponent,
    CplCalculatorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    LayoutModule,
    PhoneVerificationModule,
    ReactiveFormsModule, FormsModule,
    PagesModule,
    HttpClientModule,
    HttpModule,
    MatMenuModule,
    MatSelectModule,
    VerifyEmailModule,
    AuthenticateModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatTableModule,
    MatAutocompleteModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    WithoutSidebarModule
  ],
  entryComponents: [
    ResourceModalComponent,CplCalculatorComponent
  ],
  providers: [ServerService, ClipBoardService, UtilsService, PromptUpdateService, CheckForUpdateService,DecimalPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
