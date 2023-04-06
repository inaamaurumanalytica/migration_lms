import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
@Component({
    selector: 'client-address-delete-modal',
    templateUrl: './client-address-delete-modal.component.html',
    styleUrls: ['./client-address-delete-modal.component.scss']
})
export class ClientAddressDeleteModalComponent implements OnInit {
    projectInfo: any = JSON.parse(localStorage.getItem("projectInfo"))
    btnStatus: boolean = false
    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<ClientAddressDeleteModalComponent>,
        @Inject(MAT_DIALOG_DATA) private data
    ) {
    }

    ngOnInit() {
    }

    yes() {
        this.btnStatus = true
        this.serverService.deleteLeadAddress(this.data.id, localStorage.getItem("token")).subscribe(
            data => {
                this.btnStatus = false
                this.clipBoardService.showMessgeInText('Address Deleted Successfully', 'success-snackbar')
                this.dialogRef.close('Address Deleted Successfully')
            },
            err => {
                this.btnStatus = false
                this.clipBoardService.checkServerError(err, localStorage.getItem("token"))
            }
        )
    }

    close() {
        this.dialogRef.close();
    }
}

