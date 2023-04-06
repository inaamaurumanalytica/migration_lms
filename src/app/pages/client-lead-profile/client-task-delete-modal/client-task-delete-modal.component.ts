import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
@Component({
    selector: 'client-task-delete-modal',
    templateUrl: './client-task-delete-modal.component.html',
    styleUrls: ['./client-task-delete-modal.component.scss']
})
export class ClientTaskDeleteModalComponent implements OnInit {
    action = "";
    btnStatus: boolean = false
    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<ClientTaskDeleteModalComponent>,
        @Inject(MAT_DIALOG_DATA) private data
    ) {
    }

    ngOnInit() {
    }

    yes() {
        this.btnStatus = true
        this.serverService.deleteLeadTask(this.data.id, localStorage.getItem("token")).subscribe(
            data => {
                this.btnStatus = false
                this.clipBoardService.showMessgeInText('Task Deleted Successfully', 'success-snackbar')
                this.dialogRef.close('Task Deleted Successfully')
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

