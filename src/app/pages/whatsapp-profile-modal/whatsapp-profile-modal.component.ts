
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ClipBoardService } from '../../services/clipboard.service';
import { ServerService } from 'src/app/services/server.service';

@Component({
    selector: 'whatsapp-profile-modal',
    templateUrl: './whatsapp-profile-modal.component.html',
    styleUrls: ['./whatsapp-profile-modal.component.scss']
})
export class WhatsappProfileModalComponent implements OnInit {
    authToken = localStorage.getItem("token");
    
    btnStatus: boolean = false
    profile: any
    projectID: string
    userForm: FormGroup;
    constructor(
        public clipBoardService: ClipBoardService,
        public serverService: ServerService,
        private fb: FormBuilder,
        private snackBar: MatSnackBar,
        private dialogRef: MatDialogRef<WhatsappProfileModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data) {
        this.profile = this.data.whats_app_profile
        this.projectID = this.data.id
        
    }

    ngOnInit() {
        if (this.profile == null) {
            this.userForm = this.fb.group({
                name: [null, Validators.required],
                budget: [null, Validators.required],
                location: [null, Validators.required],
                possession: [''],
                inventory: ['']
            });
        } else {
            this.userForm = this.fb.group({
                name: [this.profile.name, Validators.required],
                budget: [this.profile.budget, Validators.required],
                location: [this.profile.location, Validators.required],
                possession: [this.profile.possession],
                inventory: [this.profile.inventory]
            });
        }
    }

    save() {
        this.btnStatus = true
        let body = {
            project_id: this.projectID,
            name: this.userForm.value.name,
            budget: this.userForm.value.budget,
            location: this.userForm.value.location,
            possession: this.userForm.value.possession,
            inventory: this.userForm.value.inventory
        }
        if (this.profile == null) {
            // console.log("hi")
            // console.log(body);
            this.serverService.createWhatsappProfile(body, this.authToken).subscribe(
                data => {
                    this.snackBar.open("Profile Created Succesfully", '', {
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
        } else {
            this.serverService.updateWhatsappProfile(this.profile.id, body, this.authToken).subscribe(
                data => {
                    this.snackBar.open("Profile Updated Succesfully", '', {
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
    }

    close() {
        this.dialogRef.close();
    }
}

