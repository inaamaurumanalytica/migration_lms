import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
@Component({
    selector: 'client-edit-modal',
    templateUrl: './client-edit-modal.component.html',
    styleUrls: ['./client-edit-modal.component.scss']
})
export class ClientEditModalComponent implements OnInit {
    authToken = localStorage.getItem("token")
    public userInfo = JSON.parse(localStorage.getItem("userInfo"));
    btnStatus: boolean = false
    editClientForm: FormGroup;
    vendor: any = {}
    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<ClientEditModalComponent>,
        @Inject(MAT_DIALOG_DATA) private data,
        private _snackBar: MatSnackBar
    ) {
        this.vendor = data
        this.editClientForm = this.fb.group({
            name: [this.data.name, Validators.required],
            city: [this.data.city],
            rera: [this.data.rera],
            trackingUnattendedLead: [this.data.tracking_unattended_lead],
            unattendedLeadCountOverhead: [this.data.unattended_lead_count_overhead],
            is_broker: [this.data.is_broker],
        });
    }

    ngOnInit() {
    }


    editClient() {

        if(this.editClientForm.value.unattendedLeadCountOverhead<3){
            this._snackBar.open('Enter Value 3 or Above', '', {
                duration: 3000,
                verticalPosition: 'top',
                horizontalPosition: 'end',
                panelClass: ['red']
            })
            return false
        }

        this.btnStatus = true;
        let body = {
            "name": this.editClientForm.value.name,
            "city": this.editClientForm.value.city,
            "rera": this.editClientForm.value.rera,
            "tracking_unattended_lead": this.editClientForm.value.trackingUnattendedLead,
            "unattended_lead_count_overhead": this.editClientForm.value.unattendedLeadCountOverhead,
            "is_broker": this.editClientForm.value.is_broker,
        };
        this.btnStatus = false
        this.serverService.updateClient(this.vendor, body, this.authToken).subscribe(
            data => {
                this.btnStatus = false;
                this.dialogRef.close(data);
                this.clipBoardService.showMessgeInText("Client Updated Succesfully", "success-snackbar");
            },
            err => {
                this.clipBoardService.checkServerError(err, this.authToken)
                this.btnStatus = false;
            }
        )
    }

    checkVal(val:any){
        if(val.target.value<3){

            // this._snackBar.open('Enter Value 3 or Above', action, {
            //     duration: 2000,
            //   });

            this._snackBar.open('Enter Value 3 or Above', '', {
                duration: 3000,
                verticalPosition: 'top',
                horizontalPosition: 'end',
                panelClass: ['red']
            })

            return false
        }
    }

    close() {
        this.dialogRef.close();
    }
}

