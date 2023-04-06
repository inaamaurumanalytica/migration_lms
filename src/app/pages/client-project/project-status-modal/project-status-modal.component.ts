import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar, MatDialog } from "@angular/material";
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service';
import { ServerService } from '../../../services/server.service';
import { DeleteProjectStatusModalComponent } from '../delete-project-status-modal/delete-project-status-modal.component';

@Component({
    selector: 'app-project-status-modal',
    templateUrl: './project-status-modal.component.html',
    styleUrls: ['./project-status-modal.component.scss']
})
export class ProjectStatusModalComponent implements OnInit {
    authToken = localStorage.getItem("token");
    btnStatus: boolean = false
    profile: any
    statusForm: FormGroup;
    season_or_offer: boolean = false
    selectTarget: any
    showErrorSuccess = false
    totalSuccessValue = 0
    audienceSuccessValue = 0;
    projectData: any = []
    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private snackBar: MatSnackBar,
        private changeDetectorRef: ChangeDetectorRef,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<ProjectStatusModalComponent>,
        @Inject(MAT_DIALOG_DATA) private data
    ) {

    }

    ngOnInit() {
        this.statusForm = this.fb.group({
            data: this.fb.array([])
        })
        this.addMore()
        this.statusForm.controls.data.valueChanges.subscribe((data) => {
            //console.log(data)
            this.onValueChanged(data)
        }
        );
    }


    genderSuccessValue = 0
    maritalSuccessValue = 0
    employeeSuccessValue = 0
    onValueChanged(data) {

        this.audienceSuccessValue = 0
        this.genderSuccessValue = 0
        this.maritalSuccessValue = 0
        this.employeeSuccessValue = 0

        this.projectData = data

        data.forEach(element => {

            this.audienceSuccessValue += element.success
            this.genderSuccessValue = element.maleSuccess + element.femaleSuccess
            this.maritalSuccessValue = element.marriedSuccess + element.unmarriedSuccess
            this.employeeSuccessValue = element.salariedSuccess + element.businessmanSuccess

            if (this.audienceSuccessValue > 100) {
                this.showErrorSuccess = true
                this.snackBar.open("Total of Percentage should not be greater than 100", '', {
                    duration: 3000,
                    verticalPosition: 'top',
                    horizontalPosition: 'end',
                    panelClass: 'blue-snackbar'
                })
            }

            else if (this.genderSuccessValue > 100) {
                this.showErrorSuccess = true;

                // console.log(this.statusForm.get('data.maleSuccess'));
                // console.log(this.statusForm.get('data.femaleSuccess'));

                this.snackBar.open("Total of Percentage should not be greater than 100", '', {
                    duration: 3000,
                    verticalPosition: 'top',
                    horizontalPosition: 'end',
                    panelClass: 'blue-snackbar'
                })
            }

            else if (this.maritalSuccessValue > 100) {
                this.showErrorSuccess = true
                this.snackBar.open("Total of Percentage should not be greater than 100", '', {
                    duration: 3000,
                    verticalPosition: 'top',
                    horizontalPosition: 'end',
                    panelClass: 'blue-snackbar'
                })
            }

            else if (this.employeeSuccessValue > 100) {
                this.showErrorSuccess = true
                this.snackBar.open("Total of Percentage should not be greater than 100", '', {
                    duration: 3000,
                    verticalPosition: 'top',
                    horizontalPosition: 'end',
                    panelClass: 'blue-snackbar'
                })
            }


            else {
                this.showErrorSuccess = false
            }
        });

        // console.log(this.audienceSuccessValue)
        // console.log(this.genderSuccessValue)
        // console.log(this.maritalSuccessValue)
        // console.log(this.employeeSuccessValue)
        // console.log(this.showErrorSuccess)
        // console.log(this.statusForm)

    }


    changeStatus() {
        this.dialog.open(DeleteProjectStatusModalComponent,
            {
                hasBackdrop: true,
                disableClose: false,
                autoFocus: true,
                data: this.data
            }
        ).afterClosed().subscribe((result) => {
            if (result == 'yes') {
                this.btnStatus = true

                for (let item in this.projectData) {
                    //console.log(this.projectData[item])

                    if (this.projectData[item].success == null) {
                        this.projectData[item].success = 0
                    }
                    
                    if (this.projectData[item].maleSuccess == null) {
                        this.projectData[item].maleSuccess = 0
                    }                     
                    if (this.projectData[item].femaleSuccess == null) {
                        this.projectData[item].femaleSuccess = 0
                    }


                    if (this.projectData[item].marriedSuccess == null) {
                        this.projectData[item].marriedSuccess = 0
                    }                     
                    if (this.projectData[item].unmarriedSuccess == null) {
                        this.projectData[item].unmarriedSuccess = 0
                    } 
                    
                    
                    if (this.projectData[item].salariedSuccess == null) {
                        this.projectData[item].salariedSuccess = 0
                    } 
                    if (this.projectData[item].businessmanSuccess == null) {
                        this.projectData[item].businessmanSuccess = 0
                    }                    


                }


                let body = {
                    id: this.data.id,
                    audiences: this.projectData
                }
                // console.log(body)
                // return false
                this.serverService.addAudienceAnalysis(body, this.authToken).subscribe(
                    data => {
                        this.snackBar.open("Status Changed Successfully", '', {
                            duration: 1000,
                            verticalPosition: 'top',
                            horizontalPosition: 'end',
                            panelClass: 'blue-snackbar'
                        })
                        this.btnStatus = false
                        this.dialogRef.close(data)
                    },
                    err => {
                        this.btnStatus = false
                        this.clipBoardService.checkServerError(err, this.authToken)
                    }
                )
            }
        })

    }

    addMore() {
        const add = this.statusForm.get('data') as FormArray;
        add.push(
            this.fb.group({

                target: 'Social Media',
                platform_name: 'Facebook Traffic',

                audience: null,
                success: [null, Validators.pattern('^[0-9]+(.[0-9]{0,2})?$')],

                male: ['Male'],
                maleSuccess: [null, Validators.pattern('^[0-9]+(.[0-9]{0,2})?$')],

                female: ['Female'],
                femaleSuccess: [null, Validators.pattern('^[0-9]+(.[0-9]{0,2})?$')],

                married: ['Married'],
                marriedSuccess: [null, Validators.pattern('^[0-9]+(.[0-9]{0,2})?$')],

                unmarried: ['Unmarried'],
                unmarriedSuccess: [null, Validators.pattern('^[0-9]+(.[0-9]{0,2})?$')],

                salaried: ['Salaried'],
                salariedSuccess: [null, Validators.pattern('^[0-9]+(.[0-9]{0,2})?$')],

                businessman: ['Businessman'],
                businessmanSuccess: [null, Validators.pattern('^[0-9]+(.[0-9]{0,2})?$')],

                age: null,
                season_or_offer: false,
            })
        )
        this.changeDetectorRef.detectChanges()
    }

    close() {
        this.dialogRef.close();
    }

    delete(index) {
        const arr = <FormArray>this.statusForm.controls.data;
        arr.removeAt(index);
    }

    // getGenderSuccessRate(val:any, type:any, i:any){
    //     console.log(val, type, i)
    //     this.statusForm.controls['femaleSuccess'].patchValue([{}])
    // }

}



