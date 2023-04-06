import { NgModule } from '@angular/core';
import { VerifyEmailComponent } from './verifyEmail.component';
import { 
        MatCardModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatInputModule,
        MatToolbarModule,
        MatSnackBarModule,
        MatIconModule
       } from '@angular/material';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';
const routes: Routes = [
    {path: '', component: VerifyEmailComponent},
  ];
@NgModule({
    imports: [
        MatCardModule,
        CommonModule,
        FlexLayoutModule,
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
        VerifyEmailComponent,
    ],
    exports: [
        RouterModule
    ],
    providers: [
    ]
})
export class VerifyEmailModule {
}
