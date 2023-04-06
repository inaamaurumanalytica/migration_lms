import { NgModule } from '@angular/core';
import { PhoneVerificationComponent, FormatTimePipe } from './phone-verification.component';
import { 
        MatCardModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatInputModule,
        MatFormFieldModule,
        MatToolbarModule,
        MatSnackBarModule,
        MatIconModule
       } from '@angular/material';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';
const routes: Routes = [
    {path: '', component: PhoneVerificationComponent},
  ];
@NgModule({
    imports: [
        MatCardModule,
        CommonModule,
        FlexLayoutModule,
        MatFormFieldModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatInputModule,
        MatToolbarModule,
        MatSnackBarModule,
        FormsModule,
        MatIconModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        PhoneVerificationComponent,
        FormatTimePipe
    ],
    exports: [
        RouterModule
    ],
    providers: [
    ]
})
export class PhoneVerificationModule {
}
