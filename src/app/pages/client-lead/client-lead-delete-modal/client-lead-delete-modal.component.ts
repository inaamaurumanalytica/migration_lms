import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
@Component({
    selector: 'client-lead-delete-modal',
    templateUrl: './client-lead-delete-modal.component.html',
    styleUrls: ['./client-lead-delete-modal.component.scss']
})
export class ClientLeadDeleteModalComponent implements OnInit {
    authToken: any = localStorage.getItem("token")
    btnStatus: boolean = false
    selectedLeads: any[] = []
    dataSource: any;
    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<ClientLeadDeleteModalComponent>,
        @Inject(MAT_DIALOG_DATA) private data
    ) {
        if (Array.isArray(this.data)) {
            this.selectedLeads = data
        } else {
            this.dataSource = this.data;
        }
    }

    ngOnInit() {
    }

    yes() {
        this.btnStatus = true
        if (this.selectedLeads.length != 0) {
            let body = {
                ids: this.selectedLeads
            };
            this.serverService.multiDeleteLead(body, this.authToken).subscribe(
                data => {
                    this.clipBoardService.showMessgeInText(data.message, "success-snackbar")
                    this.dialogRef.close("Deleted Successfully")
                },
                err => {
                    this.clipBoardService.checkServerError(err, this.authToken);
                }
            );
        } else {
            this.serverService.deleteLead(this.data.id, this.authToken).subscribe(
                data => {
                    this.dialogRef.close("yes");
                    this.clipBoardService.showMessgeInText("Lead Deleted Successfully", "success-snackbar")
                },
                err => {
                    this.clipBoardService.checkServerError(err, localStorage.getItem("token"))
                }
            )
        }


    }

    close() {
        this.dialogRef.close();
    }
}

