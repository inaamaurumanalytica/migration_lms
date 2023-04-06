import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
@Component({
    selector: 'client-project-delete-modal',
    templateUrl: './client-project-delete-modal.component.html',
    styleUrls: ['./client-project-delete-modal.component.scss']
})
export class ClientProjectDeleteModalComponent implements OnInit {
    authToken: string = localStorage.getItem("token")
    btnStatus: boolean = false
    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<ClientProjectDeleteModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data) {
    }

    ngOnInit() {
    }

    submit() {
        this.btnStatus = true
        this.serverService.deleteProject(this.data.id, this.authToken).subscribe(
            data => {
                this.btnStatus = false
                this.clipBoardService.showMessgeInText('Project Deleted Successfully', 'success-snackbar')
                this.dialogRef.close(data)
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

