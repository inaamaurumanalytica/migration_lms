import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
@Component({
    selector: 'client-lead-failed-modal',
    templateUrl: './client-lead-failed-modal.component.html',
    styleUrls: ['./client-lead-failed-modal.component.scss']
})
export class ClientLeadFailedModalComponent implements OnInit {
    projectInfo: any = JSON.parse(localStorage.getItem("projectInfo"))
    leadInfo: any = JSON.parse(localStorage.getItem("leadInfo"))
    btnStatus: boolean = false
    dataSource: any = []
    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<ClientLeadFailedModalComponent>,
        @Inject(MAT_DIALOG_DATA) private data
    ) {
        this.dataSource = data
    }

    ngOnInit() {
    }

    close() {
        this.dialogRef.close();
    }
}

