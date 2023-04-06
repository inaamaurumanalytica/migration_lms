import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
@Component({
    selector: 'client-webhook-delete-modal',
    templateUrl: './client-webhook-delete-modal.component.html',
    styleUrls: ['./client-webhook-delete-modal.component.scss']
})
export class ClientWebhookDeleteModalComponent implements OnInit {
    projectInfo: any = JSON.parse(localStorage.getItem("projectInfo"))
    leadInfo: any = JSON.parse(localStorage.getItem("leadInfo"))
    authToken: string = localStorage.getItem("token")
    btnStatus: boolean = false
    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<ClientWebhookDeleteModalComponent>,
        @Inject(MAT_DIALOG_DATA) private data
    ) {
    }

    ngOnInit() {
    }

    yes() {
        this.btnStatus = true
        this.serverService.deleteWebhook(this.data.id, this.authToken).subscribe(
            data => {
                this.btnStatus = false
                this.clipBoardService.showMessgeInText("Webhook Deleted Successfully", "success-snackbar")
                this.dialogRef.close('Webhook Deleted Successfully')
            },
            err => {
                this.btnStatus = false
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    close() {
        this.dialogRef.close();
    }
}

