import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
@Component({
    selector: 'client-lead-attachment-create-modal',
    templateUrl: './client-lead-attachment-create-modal.component.html',
    styleUrls: ['./client-lead-attachment-create-modal.component.scss']
})
export class ClientLeadAttachmentCreateModalComponent implements OnInit {
    public currentUser = JSON.parse(localStorage.getItem("userInfo"));
    authToken = localStorage.getItem("token")
    authInfo: any = JSON.parse(localStorage.getItem("authInfo"))
    projectInfo: any = JSON.parse(localStorage.getItem("projectInfo"))
    leadInfo: any = JSON.parse(localStorage.getItem("leadInfo"))
    action = "";

    saveStatus: boolean = false
    attachNoteFiles: any[] = []
    file: any = {
        "name": ""
    }
    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<ClientLeadAttachmentCreateModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data) {
    }

    ngOnInit() {
    }

    fileChangeEvent(event: any): void {
        this.file = event.target.files[0];
        document.getElementById('leadFile').classList.add('valid')
    }

    uploadFile() {
        this.saveStatus = true;
        const formData: FormData = new FormData();
        formData.append('attachment', this.file);
        formData.append('lead_id', this.leadInfo.id);
        this.serverService.uploadLeadAttachment(formData, this.authToken).subscribe(
            data => {
                this.saveStatus = false;
                this.dialogRef.close(data);
                this.clipBoardService.showMessgeInText("Attachment Added Successfully", "success-snackbar")
            },
            err => {
                this.clipBoardService.checkServerError(err, localStorage.getItem("token"))
                this.saveStatus = false;
            }
        )
    }

    close() {
        this.dialogRef.close();
    }
}

