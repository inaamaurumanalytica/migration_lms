import { NgModule } from '@angular/core';
import { ResetPasswordComponent } from './resetPassword.component';
import { 
        MatCardModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatIconModule,
        MatInputModule,
        MatToolbarModule,
        MatSnackBarModule
       } from '@angular/material';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';
const routes: Routes = [
    {path: '', component: ResetPasswordComponent},
  ];
@NgModule({
    imports: [
        MatCardModule,
        CommonModule,
        FlexLayoutModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatInputModule,
        MatIconModule,
        MatToolbarModule,
        MatSnackBarModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes)
    ],
    declarations: [   
        ResetPasswordComponent,
    ],
    exports: [
        RouterModule
    ],
    providers: [
    ]
})
export class ResetPasswordModule {
}
